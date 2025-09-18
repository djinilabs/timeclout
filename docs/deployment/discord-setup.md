# Discord Customer Service API Setup

This document explains how to set up the Discord Customer Service API environment variables for deployment.

## Required GitHub Secrets

The following secrets need to be configured in your GitHub repository settings:

### 1. DISCORD_PUBLIC_KEY

- **Description**: Discord application public key for webhook signature verification
- **Format**: Hexadecimal string (64 characters)
- **How to get**:
  1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
  2. Select your application
  3. Go to "General Information"
  4. Copy the "Public Key" value

### 2. DISCORD_CS_USERS

- **Description**: JSON array of Discord user IDs authorized to use customer service commands
- **Format**: JSON array of strings
- **Example**: `["123456789012345678", "987654321098765432"]`
- **How to get Discord User IDs**:
  1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
  2. Right-click on a user and select "Copy User ID"
  3. Add the user ID to the JSON array

## Environment Variable Setup

These secrets are automatically injected into the deployment workflows:

- **Production**: `deploy-prod.yml` - Injects into production environment
- **Staging**: `deploy-pr.yml` - Injects into staging environment for PR deployments

## Security Considerations

1. **DISCORD_PUBLIC_KEY**: This is safe to store as a secret as it's a public key used for verification
2. **DISCORD_CS_USERS**: Keep this list minimal and only include trusted customer service representatives
3. **Regular Review**: Periodically review and update the authorized users list

## Testing

To test the Discord API:

1. Set up the environment variables in your local development environment
2. Use Discord's webhook testing tools or create a test Discord application
3. Verify that only authorized users can execute commands

## Troubleshooting

### Common Issues

1. **"You are not authorized to use customer service commands"**

   - Check that the user's Discord ID is in the `DISCORD_CS_USERS` array
   - Verify the JSON format is correct (no trailing commas, proper quotes)

2. **"Unauthorized" error**

   - Check that `DISCORD_PUBLIC_KEY` is set correctly
   - Verify the webhook signature verification is working

3. **Environment variable not found**
   - Ensure the secrets are properly configured in GitHub
   - Check that the deployment workflow is using the correct secret names

### Verification

You can verify the setup by:

1. Checking the deployment logs for successful environment variable injection
2. Testing the Discord webhook endpoint with a valid signature
3. Confirming that unauthorized users receive the appropriate error message
