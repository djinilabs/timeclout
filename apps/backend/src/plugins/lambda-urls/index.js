module.exports = {
  deploy: {
    start: async ({ arc, cloudformation, stage }) => {
      // Lambda URLs configuration (outside of @http)
      if (arc['lambda-urls']) {
        console.log('Configuring Lambda URLs...');
        
        arc['lambda-urls'].forEach(lambdaDef => {
          const lambdaLogicalId = `LambdaURL${lambdaDef.replace(/\//g, '').replace(/[^a-zA-Z0-9]/g, '')}`;
          const name = lambdaDef.split(' ')[1]; // e.g., "/api/ai/chat" from "any /api/ai/chat"
          
          // Create Lambda Function URL resource
          cloudformation.Resources[`${lambdaLogicalId}URL`] = {
            Type: 'AWS::Lambda::Url',
            DependsOn: lambdaLogicalId,
            Properties: {
              AuthType: 'NONE',
              Cors: {
                AllowCredentials: true,
                AllowHeaders: ['*'],
                ExposeHeaders: ['*'],
                AllowMethods: ['*'],
                AllowOrigins: ['*'],
                MaxAge: 6000,
              },
              InvokeMode: 'RESPONSE_STREAM',
              TargetFunctionArn: {
                'Fn::GetAtt': [lambdaLogicalId, 'Arn'],
              },
            },
          };

          // Output the URL
          cloudformation.Outputs[`${lambdaLogicalId}URL`] = {
            Description: `Lambda Function URL for ${name}`,
            Value: {
              'Fn::GetAtt': [`${lambdaLogicalId}URL`, 'FunctionUrl'],
            },
          };

          // Add resource-based policy for public invocation
          cloudformation.Resources[`${lambdaLogicalId}URLPolicy`] = {
            Type: 'AWS::Lambda::Permission',
            Properties: {
              Action: 'lambda:InvokeFunctionUrl',
              FunctionName: {
                'Fn::GetAtt': [lambdaLogicalId, 'Arn'],
              },
              Principal: '*',
              FunctionUrlAuthType: 'NONE',
            },
          };
        });
      }

      return cloudformation;
    }
  }
};
