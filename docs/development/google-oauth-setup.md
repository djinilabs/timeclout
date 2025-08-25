# Google OAuth Setup Guide

This guide explains how to set up Google OAuth authentication for the TT3 application.

## Prerequisites

- A Google Cloud Platform account
- Access to the Google Cloud Console
- The application deployed and accessible via HTTPS

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace organization)
3. Fill in the required information:
   - **App name**: TT3
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Add the following scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses) if in testing mode
6. Save and continue

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application** as the application type
4. Configure the following:
   - **Name**: TT3 Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://app.tt3.app` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/v1/auth/callback/google` (for development)
     - `https://app.tt3.app/api/v1/auth/callback/google` (for production)
5. Click **Create**
6. Note down the **Client ID** and **Client Secret**

## Step 4: Configure Environment Variables

### For Development

1. Run the environment setup script:

   ```bash
   pnpm dev:update-env
   ```

2. Edit the `.env` file in the `apps/backend` directory and replace the placeholder values:
   ```bash
   GOOGLE_CLIENT_ID="your-actual-google-client-id"
   GOOGLE_CLIENT_SECRET="your-actual-google-client-secret"
   ```

### For Production

1. Add the following secrets to your GitHub repository:

   - Go to your repository settings
   - Navigate to **Secrets and variables** > **Actions**
   - Add the following secrets:
     - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
     - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret

2. The deployment workflow will automatically use these secrets

## Step 5: Update Authorized Domains

1. In the Google Cloud Console, go to **APIs & Services** > **OAuth consent screen**
2. Add your domain (`tt3.app`) to the **Authorized domains** section
3. Save the changes

## Step 6: Test the Integration

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Navigate to the login page
3. Test both authentication methods:
   - **Google OAuth**: Click "Continue with Google" and complete the OAuth flow
   - **Email Link**: Click "Sign in with email link", enter your email address, and check for the sign-in link in your email
4. Verify that you can sign in successfully with both methods

## Troubleshooting

### Common Issues

1. **"Error: redirect_uri_mismatch"**

   - Ensure the redirect URI in Google Cloud Console matches exactly
   - Check that you're using the correct protocol (http vs https)
   - Verify the port number for local development

2. **"Error: invalid_client"**

   - Verify your Client ID and Client Secret are correct
   - Ensure the credentials are for a Web application, not a Desktop application

3. **"Error: access_denied"**

   - Check that your email is in the test users list (if in testing mode)
   - Verify the OAuth consent screen is properly configured

4. **"Error: unauthorized_client"**
   - Ensure the Google+ API is enabled in your Google Cloud project
   - Check that your OAuth consent screen is published (if not in testing mode)

### Security Considerations

1. **Never commit secrets to version control**

   - Always use environment variables for sensitive data
   - Use GitHub Secrets for production deployments

2. **Regularly rotate credentials**

   - Periodically regenerate your Client Secret
   - Update environment variables accordingly

3. **Monitor usage**
   - Check Google Cloud Console for unusual activity
   - Review OAuth consent screen analytics

## Next Steps

Once Google OAuth is working, you can:

1. Add more OAuth providers (GitHub, Microsoft, etc.)
2. Implement passkeys for passwordless authentication
3. Add account linking functionality
4. Implement user profile management

## Support

If you encounter issues:

1. Check the Google Cloud Console error logs
2. Review the application logs for authentication errors
3. Verify all environment variables are correctly set
4. Test with a different browser or incognito mode
