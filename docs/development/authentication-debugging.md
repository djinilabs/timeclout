# Authentication Debugging Guide

## Issue: Email authentication not working after Google OAuth

### Problem Description

When a user first signs in with Google OAuth, and then tries to sign in with email (same email address), the email sign-in link is not sent.

### Root Cause Analysis

This issue typically occurs due to one of these reasons:

1. **Account Linking Conflict**: NextAuth.js tries to link the email account to the existing Google account, but the flow isn't handled properly.

2. **Database State**: The user record exists but the email authentication flow isn't finding it correctly.

3. **Provider Configuration**: The mailgun provider isn't configured to handle existing users properly.

### Debugging Steps

#### 1. Check NextAuth.js Logs

Look for these log messages in your application logs:

```javascript
// In signIn callback
console.log("signIn", user, account, profile);

// In signIn event
console.log("signIn event", { user, isNewUser, account });
```

#### 2. Verify User State

Check if the user exists in the database:

```bash
# Check DynamoDB for user records
aws dynamodb scan --table-name next-auth --filter-expression "contains(pk, :user)" --expression-attribute-values '{":user": {"S": "users/YOUR_USER_ID"}}'
```

#### 3. Test Email Authentication Flow

1. **Clear browser data** (cookies, local storage)
2. **Sign in with Google** first
3. **Sign out completely**
4. **Try email authentication** with the same email
5. **Check logs** for any error messages

#### 4. Check Mailgun Configuration

Verify that Mailgun is properly configured:

```javascript
// Check if email is being sent
console.log("Mailgun configuration:", {
  from: "info@timehaupt.com",
  domain: "timehaupt.com",
});
```

### Potential Solutions

#### Solution 1: Force Email Authentication

If the issue persists, you can force email authentication by:

1. **Clearing the user's session** completely
2. **Using a different email** for testing
3. **Checking if the email is in the whitelist**

#### Solution 2: Update Auth Configuration

The current configuration should handle this, but you can try:

```javascript
// In the signIn callback, add more specific handling
async signIn({ user, account, profile }) {
  console.log("signIn callback", { user, account, profile });

  // Always allow email authentication for whitelisted emails
  if (account?.type === "email") {
    return acceptableEmailAddresses.has(user.email ?? "");
  }

  // Allow Google OAuth for whitelisted emails
  if (account?.provider === "google") {
    return acceptableEmailAddresses.has(user.email ?? "");
  }

  return false;
}
```

#### Solution 3: Check NextAuth.js Version

Ensure you're using a compatible version of NextAuth.js:

```bash
pnpm list next-auth
```

### Testing Steps

1. **Fresh Start Test**:

   - Clear all browser data
   - Sign in with email only
   - Verify email is received

2. **Google First Test**:

   - Sign in with Google
   - Sign out
   - Try email authentication
   - Check logs for errors

3. **Email First Test**:
   - Sign in with email
   - Sign out
   - Try Google authentication
   - Verify account linking works

### Common Issues and Fixes

#### Issue: "User already exists"

- **Cause**: NextAuth trying to create duplicate user
- **Fix**: Ensure proper account linking configuration

#### Issue: "Email not sent"

- **Cause**: Mailgun configuration or rate limiting
- **Fix**: Check Mailgun logs and configuration

#### Issue: "Invalid email"

- **Cause**: Email not in whitelist
- **Fix**: Add email to `acceptableEmailAddresses` set

### Next Steps

1. **Monitor logs** during authentication attempts
2. **Test with different email addresses**
3. **Verify Mailgun is working** independently
4. **Check NextAuth.js documentation** for account linking best practices

### Additional Resources

- [NextAuth.js Account Linking](https://next-auth.js.org/configuration/callbacks#signin)
- [Mailgun Provider Documentation](https://next-auth.js.org/providers/email)
- [Google OAuth Provider](https://next-auth.js.org/providers/google)
