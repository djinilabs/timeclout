const http = require('http');
const {getLambdaName, toLogicalID } = require('@architect/utils');
const { ResponseStream } = require('lambda-stream');

const getConfig = ({arc, inventory}) => {
  const lambdaUrls = (arc['lambda-urls'] ?? []).map((lambda) => lambda.join(' '));
  const lambdas = Object.fromEntries(lambdaUrls.map((lambda) => {
    console.log('lambda', lambda);
    const lambdaDef = inventory.get.http(lambda);
    if (!lambdaDef) {
      throw new Error(`Lambda ${lambda} not found`);
    }
    return [lambda, lambdaDef];
  }));
  return lambdas;
};

const getLambdaLogicalId = (lambdaDef) => {
  const lambdaName = getLambdaName(lambdaDef.path);
  return toLogicalID(`${lambdaDef.method}${lambdaName.replace(/000/g, '')}HTTPLambda`)
}

const getLambdaURLLogicalId = (lambdaDef) => {
  const lambdaLogicalId = getLambdaLogicalId(lambdaDef);
  return `${lambdaLogicalId}URL`
}

const getStreamingLambdaServerPort = () => {
  const portPrefix = process.env.STREAMING_LAMBDA_SERVER_PORT_PREFIX || '91';
  const portSuffix = process.env.VITEST_WORKER_ID ?? '1';
  return Number(`${portPrefix}${portSuffix.padStart(2, '0')}`);
};

const lambdaUrl = (lambdaDef, stage) => {
  if (stage !== 'testing') {
    return {
      'Fn::GetAtt': [getLambdaURLLogicalId(lambdaDef), 'FunctionUrl']
    }
  }
  // for the sandbox, we need to return a url that is unique for each worker
  return `http://localhost:${getStreamingLambdaServerPort()}/${getLambdaLogicalId(lambdaDef)}`;
}

const loadLambdaHandler = (lambdaDef) => {
  const { handlerFile } = lambdaDef;
  // Delete the module from require cache to force reload
  delete require.cache[require.resolve(handlerFile)];
  // Require the handler file again
  const { handler } = require(handlerFile);
  if (!handler) {
    throw new Error(`Handler for lambda ${lambdaDef.path} not found: ${handlerFile}`);
  }
  return handler;
}

const createStreamingLambdaServer = (lambdas) => {
  const server = http.createServer(async (req, res) => {
    // get the lambda name from the url
    let lambdaName = req.url.slice(1); // Remove leading slash
    // also remove any query params
    [lambdaName] = lambdaName.split('?');
    const lambdaDef = Object.values(lambdas).find(
      (l) => getLambdaLogicalId(l) === lambdaName
    );

    // add CORS headers to the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Max-Age', '60');

    if (!lambdaDef) {
      console.error(`Lambda ${lambdaName} not found`);
      res.statusCode = 404;
      res.end(`Lambda not found: ${lambdaName}`);
      return;
    }

    const handler = loadLambdaHandler(lambdaDef);

    // construct a fake lambda event from the request
    const lambdaEvent = {
      body: await new Promise((resolve) => {
        req.setEncoding('utf-8');
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          resolve(body);
        });
      }),
      isBase64Encoded: false,
      rawPath: req.url,
      requestContext: {
        http: {
          method: req.method
        }
      },
      headers: Object.fromEntries(
        Object.entries(req.headers).map(([key, value]) => [
          key.toLowerCase(),
          value
        ])
      ),
      queryStringParameters: Object.fromEntries(
        new URL(req.url, 'http://localhost').searchParams.entries()
      )
    };

    console.log('lambdaEvent', lambdaEvent);

    // invoke the lambda and let it stream the response
    try {
      const responseStream = new ResponseStream();
      // poor-mans pipe
      responseStream.write = (data) => {
        res.write(data);
      }
      responseStream.end = (data) => {
        res.end(data);
      }
      responseStream.on('error', (error) => {
        console.error('responseStream.error', error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
      await handler(lambdaEvent, responseStream);
      // wait for res to end
      await new Promise((resolve) => {
        res.once('finish', resolve);
      });
    } catch (error) {
      console.error(`Lambda ${lambdaName} error:`, error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  return {
    start: (port) => {
      return new Promise((resolve) => {
        server.listen(port, () => {
          console.error(`Streaming lambda server listening on port ${port}`);
          resolve();
        });
      });
    },
    stop: () => {
      return new Promise((resolve) => {
        server.close(() => {
          console.log('Streaming lambda server stopped');
          resolve();
        });
      });
    },
  };
};

const createURLLambdaResource = (cloudformation, lambdaDef) => {
  const lambdaLogicalId = getLambdaLogicalId(lambdaDef);
  const lambdaURLLogicalId = getLambdaURLLogicalId(lambdaDef);
  cloudformation.Resources[lambdaURLLogicalId] = {
    Type: 'AWS::Lambda::Url',
    DependsOn: 'Role',
    Properties: {
      AuthType: 'NONE',
      Cors: {
        AllowCredentials: true,
        // TODO: FIX THIS, do not allow all headers from all origins
        AllowHeaders: ['*'],
        ExposeHeaders: ['*'],
        AllowMethods: ['*'],
        AllowOrigins: ['*'],
        MaxAge: 6000
      },
      InvokeMode: 'RESPONSE_STREAM',
      TargetFunctionArn: {
        'Fn::GetAtt': [lambdaLogicalId, 'Arn']
      }
    }
  };

  // Add resource-based policy to allow public invocation
  cloudformation.Resources[`${lambdaLogicalId}URLPolicy`] = {
    Type: 'AWS::Lambda::Permission',
    Properties: {
      Action: 'lambda:InvokeFunctionUrl',
      FunctionName: {
        'Fn::GetAtt': [lambdaLogicalId, 'Arn']
      },
      Principal: '*',
      FunctionUrlAuthType: 'NONE'
    }
  };

  return cloudformation;
}

const deploy = {
  start: async ({arc, inventory, cloudformation}) => {
    const lambdas = getConfig({arc, inventory});
    for (const [, lambdaDef] of Object.entries(lambdas)) {
      createURLLambdaResource(cloudformation, lambdaDef);
    }
    return cloudformation;
  },
  services: async ({arc, inventory, stage }) => {
    const lambdas = getConfig({arc, inventory});
    const services = Object.fromEntries(Object.values(lambdas).map((lambdaDef) => {
      return [getLambdaLogicalId(lambdaDef), lambdaUrl(lambdaDef, stage)];
    }));
    return services;
  }
}

let server = null;

const sandbox = {
  async start({arc, inventory}) {
    if (!server) {
      const lambdas = Object.values(getConfig({arc, inventory}));
      server = createStreamingLambdaServer(lambdas);
      await server.start(getStreamingLambdaServerPort());
    }
  },
  async end() {
    if (server) {
      await server.stop();
      server = null;
    }
  }
}

module.exports = {
  deploy,
  sandbox
}