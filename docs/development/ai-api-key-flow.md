# AI API Key Transmission Flow

This document explains exactly how the Gemini API key flows from GitHub Secrets to the AI SDK configuration.

## Complete Flow Diagram

```
┌─────────────────────┐
│  GitHub Secrets      │
│  GEMINI_API_KEY      │
└──────────┬───────────┘
           │
           v
┌─────────────────────┐
│  GitHub Actions      │  .github/workflows/deploy-prod.yml
│  Load Secret          │  Line 65: GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
└──────────┬───────────┘
           │
           v
┌─────────────────────┐
│  Architect CLI      │  pnpm arc env --add
│  Store in AWS       │  Stores in Systems Manager Parameter Store
│  Systems Manager    │  Path: /tt3/production/GEMINI_API_KEY
└──────────┬───────────┘
           │
           v
┌─────────────────────┐
│  Lambda Deployment  │  Architect injects as environment variable
│  Runtime            │  Available as process.env.GEMINI_API_KEY
└──────────┬───────────┘
           │
           v
┌─────────────────────┐
│  Lambda Handler     │  apps/backend/src/http/post-api-ai-chat/index.ts
│  Module Load        │  Lines 7-10: Read at module initialization
└──────────┬───────────┘
           │
           v
┌─────────────────────┐
│  AI SDK Config      │  const google = createGoogleGenerativeAI({
│  Google Gemini      │    apiKey: process.env.GEMINI_API_KEY || "",
│                     │  });
└─────────────────────┘
```

## Step-by-Step Explanation

### 1. GitHub Secrets (Source of Truth)

Stored in: Repository → Settings → Secrets and variables → Actions

- **Secret Name**: `GEMINI_API_KEY`
- **Value**: Your Gemini API key (e.g., `AIzaSy...`)

### 2. GitHub Actions Deployment

**File**: `.github/workflows/deploy-prod.yml`

```yaml
env:
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }} # Line 65

run: |
  pnpm arc env --add --env production GEMINI_API_KEY "${GEMINI_API_KEY}"  # Line 78
```

**What happens**: The secret is loaded from GitHub and passed to the `arc env` command.

### 3. Architect Stored in AWS Systems Manager Parameter Store

**Command executed**:

```bash
pnpm arc env --add --env production GEMINI_API_KEY "your-actual-key"
```

**Storage location**:

- **Service**: AWS Systems Manager Parameter Store
- **Path**: `/tt3/production/GEMINI_API_KEY`
- **Encryption**: Server-side encryption enabled
- **Type**: SecureString

### 4. Lambda Deployment

When Architect deploys the Lambda function:

1. Architect reads parameters from Systems Manager
2. Injects them as environment variables in the CloudFormation template
3. AWS Lambda receives: `GEMINI_API_KEY=your-actual-key`

### 5. Lambda Function Execution

**File**: `apps/backend/src/http/post-api-ai-chat/index.ts`

```typescript
// Lines 7-10: Executed when module loads (NOT inside handler)
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "", // Reads from Lambda environment
});
```

**When does this run?**

- **Module load time**: Every time the Lambda container starts
- **Cold start**: When Lambda is invoked for the first time
- **Warm start**: Subsequent invocations reuse the same container

### 6. AI SDK Usage

```typescript
// Line 59: Inside handler, model is already configured
const model = google(MODEL_NAME);

// Line 62: streamText uses the pre-configured key
const result = await streamText({
  model,
  messages: messages.map((msg) => ({ ... })),
});
```

## Security Aspects

### ✅ Protected

- API key never appears in browser/client code
- Stored securely in AWS Systems Manager
- Encrypted at rest in AWS
- Only accessible to Lambda function with proper IAM permissions

### ✅ Environment Isolation

- Production: `/tt3/production/GEMINI_API_KEY`
- Staging/PR: `/tt3/staging/GEMINI_API_KEY`
- Local dev: From `.env` file (or local Systems Manager)

## Troubleshooting

### If API key is not available

**Symptoms**: Empty API key or 401 errors from Gemini

**Debug steps**:

1. **Check GitHub Secret exists**:

   ```bash
   gh secret list  # If you have gh CLI
   ```

2. **Verify deployment set the parameter**:

   ```bash
   aws ssm get-parameter --name /tt3/production/GEMINI_API_KEY \
     --with-decryption --region eu-west-2
   ```

3. **Check Lambda environment variables**:

   - AWS Console → Lambda → Your function → Configuration → Environment variables
   - Should see `GEMINI_API_KEY` listed

4. **Check Lambda logs**:
   ```bash
   aws logs tail /aws/lambda/tt3-production-post-api-ai-chat \
     --follow --region eu-west-2
   ```

### Common Issues

**Issue**: "API key not found"

- **Solution**: Run `pnpm arc env --add --env production GEMINI_API_KEY "your-key"`

**Issue**: "Invalid API key"

- **Solution**: Verify the key in GitHub Secrets matches your actual key

**Issue**: Works locally but not in production

- **Solution**: Ensure `GEMINI_API_KEY` is set in production environment, not just staging

## Testing Locally

For local development, you can either:

### Option 1: Use .env file (recommended for development)

Create `apps/backend/.env`:

```bash
GEMINI_API_KEY=your-key-here
```

Architect Sandbox will automatically load this.

### Option 2: Set in your shell

```bash
export GEMINI_API_KEY=your-key-here
cd apps/backend && pnpm arc sandbox
```

## References

- [Architect Environment Variables](https://arc.codes/docs/en/reference/cli/env)
- [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)
- [Lambda Environment Variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html)
