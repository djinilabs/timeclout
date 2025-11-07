# TimeClout Deployment & Infrastructure

## Overview

TimeClout is deployed on AWS using a modern serverless architecture with automated CI/CD pipelines. This document covers the infrastructure setup, deployment processes, environment management, and operational considerations for running TimeClout in production.

## 🏗️ Infrastructure Architecture

### AWS Services Used

1. **AWS Lambda**: Serverless compute for backend functions
2. **Amazon API Gateway**: HTTP API management and routing
3. **Amazon DynamoDB**: Primary database with encryption and backup
4. **Amazon S3**: Static file hosting for frontend assets
5. **Amazon CloudFront**: Global content delivery network
6. **Amazon Route 53**: DNS management and domain routing
7. **Amazon Certificate Manager**: SSL/TLS certificate management
8. **Amazon CloudWatch**: Monitoring, logging, and alerting

### Architecture Overview

```
Internet
    ↓
CloudFront (CDN)
    ↓
API Gateway + Lambda
    ↓
DynamoDB (Database)
```

### Regional Configuration

- **Primary Region**: `eu-west-2`
- **CDN**: Global distribution via CloudFront
- **Database**: Single-region DynamoDB

## 🚀 Deployment Framework

### Architect Framework

TimeClout uses the **Architect Framework** (`@architect/architect`) for infrastructure as code:

```typescript
// apps/backend/app.arc
@app
tt3

@http
any /*
any /api/v1/auth/*
get /api/v1/ical/*
any /graphql

@static
spa true

@tables
next-auth
  pk *String
  sk **String
  expires TTL
  encrypt true

entity
  pk *String
  name String
  parentPk String
  encrypt true

@aws
runtime typescript
region eu-west-2
```

### Key Benefits

- **Infrastructure as Code**: Version-controlled infrastructure
- **Serverless First**: Automatic scaling and cost optimization
- **Type Safety**: TypeScript support throughout the stack
- **Local Development**: Sandbox environment for testing
- **Environment Management**: Local development, PR previews, and production

## 🔧 Build & Deployment Process

### Build Configuration

#### Frontend Build

```bash
# Build frontend assets
pnpm build

# Output: apps/frontend/dist/
# Static files served via S3 + CloudFront
```

#### Backend Build

```bash
# Build backend functions
cd apps/backend
pnpm arc build

# Output: apps/backend/dist/
# Lambda functions with dependencies
```

#### Build Tools

- **Frontend**: Vite with React and TypeScript
- **Backend**: esbuild with TypeScript support
- **GraphQL**: Code generation for type safety

### Deployment Commands

#### PR Preview Deployment

```bash
# Deploy PR to preview environment
cd apps/backend
pnpm arc deploy --name "PR123" --staging

# Access via: https://123.timeclout.com
```

**Note**: The `--staging` flag is used for PR preview deployments, not a separate staging environment.

#### Production Deployment

```bash
# Deploy to production
cd apps/backend
pnpm arc deploy --production

# Access via: https://app.timeclout.com
```

#### PR Preview Deployment

```bash
# Deploy PR to preview environment
pnpm arc deploy --name "PR123" --staging

# Access via: https://123.timeclout.com
```

## 🌍 Environment Management

### Environment Variables

#### Required Environment Variables

```bash
# Authentication
AUTH_SECRET=your-auth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS Configuration
TimeClout_CERTIFICATE_ARN=arn:aws:acm:eu-west-2:...
TimeClout_ZONE_ID=your-route53-zone-id
TimeClout_CUSTOM_DOMAIN=app.timeclout.com

# Monitoring
SENTRY_DSN=your-sentry-dsn
SENTRY_TRACES_SAMPLE_RATE=1.0
SENTRY_PROFILES_SAMPLE_RATE=1.0

# Analytics
VITE_PUBLIC_POSTHOG_KEY=your-posthog-key
VITE_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

#### Environment-Specific Configuration

```bash
# Local Development
NODE_ENV=development
BASE_URL=http://localhost:3333

# Production Environment
NODE_ENV=production
BASE_URL=https://app.timeclout.com

# PR Environment
NODE_ENV=production
BASE_URL=https://123.timeclout.com
```

### Environment Setup

#### 1. Local Development

```bash
# Start local sandbox
cd apps/backend
pnpm arc sandbox

# Access local services
# - HTTP: http://localhost:3333
# - DynamoDB: http://localhost:${ARC_DB_PORT}
# - GraphQL: http://localhost:3333/graphql
```

#### 2. PR Preview Environments

```bash
# Deploy PR to preview environment
pnpm arc deploy --name "PR123" --staging

# Access via: https://123.timeclout.com
```

#### 3. Production Environment

```bash
# Deploy to production
pnpm arc deploy --production

# Set production environment variables
pnpm arc env --add --env production AUTH_SECRET "prod-secret"
pnpm arc env --add --env production GOOGLE_CLIENT_ID "prod-id"
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. Test Workflow (`test.yml`)

**Trigger**: Every push to main and pull request
**Purpose**: Code quality and build verification

```yaml
- name: Run tests
  run: |
    pnpm lint
    pnpm typecheck
    pnpm test
    pnpm build
```

#### 2. Deploy PR Workflow (`deploy-pr.yml`)

**Trigger**: Pull request events
**Purpose**: Deploy PR to preview environment

```yaml
- name: Deploy PR
  run: |
    cd apps/backend
    pnpm arc deploy --name "PR${{ github.event.pull_request.number }}" --staging
```

#### 3. E2E Tests Workflow (`e2e-tests.yml`)

**Trigger**: After PR deployment
**Purpose**: End-to-end testing against deployed PR environment

```yaml
- name: Run E2E tests
  run: |
    pnpm test:e2e
```

**Note**: E2E tests run against the deployed PR preview environment, not locally.

#### 4. Deploy Production Workflow (`deploy-prod.yml`)

**Trigger**: Merge to main branch
**Purpose**: Deploy to production environment

```yaml
- name: Deploy to production
  run: |
    cd apps/backend
    pnpm arc deploy --production
```

#### 5. Auto Merge Workflow (`auto-merge.yml`)

**Trigger**: When all checks pass
**Purpose**: Automatically merge approved PRs

### Deployment Pipeline Flow

```
Pull Request → Test → Deploy PR → E2E Tests → Auto Merge → Deploy Production
     ↓           ↓         ↓         ↓         ↓         ↓
   Opened    Quality   Preview   Validate   Merge     Production
             Checks    Deploy    Tests      PR        Deploy
```

## 🗄️ Database Infrastructure

### DynamoDB Configuration

#### Table Structure

```typescript
// Core tables defined in app.arc
@tables
next-auth          // Authentication data
entity             // Organizational entities
entity_settings    // Entity configuration
permission         // User permissions
invitation         // User invitations
leave_request      // Leave requests
leave              // Approved leave
shift_positions    // Shift scheduling data
```

#### Table Properties

- **Encryption**: All tables encrypted at rest
- **TTL**: Automatic expiration for temporary data
- **Backup**: Point-in-time recovery enabled
- **Deletion Protection**: Production tables protected

#### Global Secondary Indexes (GSIs)

The system uses multiple GSIs for efficient querying. The exact indexes are defined in `apps/backend/app.arc` and may change over time as the application evolves.

### Production Table Protection

#### Deletion Protection Script

```bash
# Check protection status
./scripts/protect-production-tables.sh status

# Enable protection on all production tables
./scripts/protect-production-tables.sh protect

# Protect specific table
./scripts/protect-production-tables.sh protect-table TABLE_NAME
```

#### Protected Tables

| Table Name                            | Purpose          | Protection Status |
| ------------------------------------- | ---------------- | ----------------- |
| `Tt3Production-EntityTable-*`         | Entity data      | ✅ Protected      |
| `Tt3Production-PermissionTable-*`     | User permissions | ✅ Protected      |
| `Tt3Production-ShiftPositionsTable-*` | Shift data       | ✅ Protected      |

## 🌐 Domain & SSL Configuration

### Custom Domain Setup

#### Domain Configuration

```typescript
// apps/backend/src/plugins/custom-domain/index.js
const customDomain = process.env.TimeClout_CUSTOM_DOMAIN;
const CertificateArn = process.env.TimeClout_CERTIFICATE_ARN;
const HostedZoneId = process.env.TimeClout_ZONE_ID;

if (customDomain) {
  cloudformation.Resources.HTTP.Properties.Domain = {
    DomainName: customDomain,
    CertificateArn,
    Route53: {
      HostedZoneId,
      DistributionDomainName: customDomain,
    },
  };
}
```

#### Environment Variables

```bash
# Production domain
TimeClout_CUSTOM_DOMAIN=app.timeclout.com
TimeClout_CERTIFICATE_ARN=arn:aws:acm:eu-west-2:...
TimeClout_ZONE_ID=Z1234567890ABC

# PR preview domains
TimeClout_CUSTOM_DOMAIN=123.timeclout.com  # For PR #123
```

### SSL Certificate Management

#### Certificate Requirements

- **Region**: Must be in `eu-west-2` (same as API Gateway)
- **Domain**: Must cover `*.timeclout.com` and `timeclout.com`
- **Status**: Must be validated and active

#### Route 53 Configuration

- **Hosted Zone**: `timeclout.com` managed in Route 53
- **Records**: Automatic creation for subdomains
- **Health Checks**: Automatic health monitoring

## 📊 Monitoring & Observability

### Sentry Integration

#### Error Tracking

```typescript
// Backend error tracking
import * as Sentry from "@sentry/aws-serverless";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "1.0"),
  profilesSampleRate: parseFloat(
    process.env.SENTRY_PROFILES_SAMPLE_RATE || "1.0"
  ),
});
```

#### Frontend Error Tracking

```typescript
// Frontend error tracking
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_PUBLIC_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### CloudWatch Monitoring

#### Metrics Tracked

- **Lambda Invocations**: Function execution count and duration
- **API Gateway**: Request count, latency, and error rates
- **DynamoDB**: Read/write capacity, throttling, and errors
- **CloudFront**: Request count, cache hit rates, and errors

#### Log Aggregation

- **Lambda Logs**: Structured logging with correlation IDs
- **API Gateway Logs**: Request/response logging
- **Application Logs**: Custom business logic logging

## 🔒 Security Configuration

### Data Encryption

#### At Rest Encryption

- **DynamoDB**: AES-256 encryption for all tables
- **S3**: Server-side encryption for static assets
- **Lambda**: Environment variables encrypted

#### In Transit Encryption

- **HTTPS**: TLS 1.2+ for all API communications
- **API Gateway**: End-to-end encryption
- **CloudFront**: Edge-to-origin encryption

### Access Control

#### IAM Roles

- **Lambda Execution Role**: Minimal permissions for function execution
- **API Gateway Role**: API management and invocation permissions
- **CloudWatch Role**: Monitoring and logging permissions

#### Environment Variable Security

```bash
# Sensitive data stored as encrypted environment variables
pnpm arc env --add --env production AUTH_SECRET "encrypted-secret"
pnpm arc env --add --env production GOOGLE_CLIENT_SECRET "encrypted-secret"
```

## 🚨 Disaster Recovery

### Backup Strategy

#### DynamoDB Backups

- **Point-in-Time Recovery**: Continuous backup with 35-day retention
- **On-Demand Backups**: Manual backups for major releases
- **Cross-Region Replication**: Critical data replicated to backup region

#### Application Data

- **Configuration**: Environment variables and settings backed up
- **Code**: Version control with Git
- **Assets**: S3 static hosting for frontend files

### Recovery Procedures

#### Database Recovery

```bash
# Restore from point-in-time
aws dynamodb restore-table-from-point-in-time \
  --source-table-name "Tt3Production-EntityTable-*" \
  --target-table-name "Tt3Production-EntityTable-Restored" \
  --restore-date-time "2024-03-15T10:00:00Z"
```

#### Application Recovery

```bash
# Revert to previous commit and create PR
git revert <commit-hash>
git push origin main

# The CI/CD pipeline will automatically deploy the reverted version
```

## 📈 Performance Optimization

### Lambda Optimization

#### Cold Start Reduction

- **Provisioned Concurrency**: For critical functions
- **Dependency Optimization**: Minimal package size
- **Memory Configuration**: Optimal memory allocation

#### Performance Monitoring

Performance monitoring is handled by Sentry, which tracks:

- **Function Execution Time**: Lambda performance metrics
- **Error Rates**: Application error tracking
- **User Experience**: Frontend performance monitoring
- **Custom Metrics**: Business-specific performance indicators

### Database Optimization

#### DynamoDB Performance

- **Partition Key Design**: Optimal data distribution
- **GSI Usage**: Efficient query patterns
- **Capacity Planning**: Auto-scaling configuration

#### Query Optimization

```typescript
// Efficient query patterns
const result = await entity.query({
  KeyConditionExpression: "pk = :pk",
  ExpressionAttributeValues: { ":pk": companyPk },
  IndexName: "byParentPk", // Use appropriate GSI
});
```

## 🧪 Testing Infrastructure

### Local Testing

#### Sandbox Environment

```bash
# Start local services
pnpm arc sandbox

# Run tests against local environment
pnpm test
pnpm test:e2e
```

#### Local Database

```bash
# Local DynamoDB
pnpm arc sandbox --tables

# Access via: http://localhost:${ARC_DB_PORT}
```

### Testing Infrastructure

#### Local Testing

```bash
# Run tests against local sandbox
pnpm test
pnpm test:e2e
```

**Note**: Local E2E tests run against the local sandbox environment.

#### E2E Testing

```bash
# Local E2E tests (against local sandbox)
pnpm test:e2e

# PR E2E tests (automatically triggered by CI/CD)
# Runs against deployed PR environment
```

**Note**: The E2E Tests workflow runs against the deployed PR preview environment, while local E2E tests run against the local sandbox.

## 🔧 Maintenance & Operations

### Regular Maintenance

#### Security Updates

- **Dependencies**: Regular security patches
- **Runtime**: Node.js version updates
- **Infrastructure**: AWS service updates

### Troubleshooting

#### Common Issues

##### 1. Deployment Failures

**Symptoms**: Build or deployment errors
**Solutions**:

```bash
# Check build logs
pnpm build --verbose

# Verify environment variables
pnpm arc env --list --env production

# Check AWS credentials
aws sts get-caller-identity
```

##### 2. Database Performance Issues

**Symptoms**: Slow queries, throttling
**Solutions**:

```bash
# Check DynamoDB metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/DynamoDB \
  --metric-name ConsumedReadCapacityUnits \
  --dimensions Name=TableName,Value=Tt3Production-EntityTable-*

# Analyze query patterns
aws dynamodb describe-table \
  --table-name Tt3Production-EntityTable-*
```

##### 3. API Gateway Issues

**Symptoms**: 5xx errors, timeouts
**Solutions**:

```bash
# Check Lambda logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/tt3"

# Verify function configuration
aws lambda get-function --function-name tt3-http-*
```

## 🔮 Future Infrastructure Plans

### Planned Improvements

1. **Multi-Region Deployment**: Active-active configuration
2. **Advanced Monitoring**: Custom dashboards and alerting
3. **Automated Scaling**: Predictive scaling based on usage patterns
4. **Cost Optimization**: Reserved capacity and spot instances
5. **Security Enhancements**: Advanced threat detection

### Technology Upgrades

1. **Runtime Updates**: Latest Node.js LTS versions
2. **Framework Updates**: Latest Architect Framework features
3. **Service Integration**: Additional AWS services as needed
4. **Performance Tools**: Advanced profiling and optimization

---

**Version**: 1.0.0  
**Maintainer**: DevOps Team  
**Last Updated**: March 2024
