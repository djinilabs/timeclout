module.exports = {
  deploy: {
    start: async ({ cloudformation, stage }) => {
      if (stage !== 'production') {
        return cloudformation;
      }
      const customDomain = process.env.TT3_CUSTOM_DOMAIN;
      const CertificateArn = process.env.TT3_CERTIFICATE_ARN;
      const HostedZoneId = process.env.TT3_ZONE_ID;
      console.log(`Custom domain: stage = ${stage}, custom domain = ${customDomain}`);
      if (customDomain) {
        console.log(`Configuring domain name in deploy: ${customDomain}`);
        console.log('custom domain = ' + customDomain);
        console.log('certificate ARN = ' + CertificateArn);
        console.log('hosted zone id = ' + HostedZoneId);
        cloudformation.Resources.HTTP.Properties.Domain = {
          DomainName: customDomain,
          CertificateArn,
          Route53: {
            HostedZoneId,
            DistributionDomainName: customDomain,
          }
        };
      } else {
        delete cloudformation.Resources.HTTP.Properties.Domain;
      }

      return cloudformation;
    }
  }
};