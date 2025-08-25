# Production DynamoDB Table Protection

This directory contains scripts and documentation for protecting production DynamoDB tables from accidental deletion.

## Overview

Production DynamoDB tables (prefixed with "Tt3Prod") are critical infrastructure that should never be accidentally deleted. This protection is implemented using AWS DynamoDB's **Deletion Protection** feature.

## What is Deletion Protection?

Deletion Protection is an AWS DynamoDB feature that prevents tables from being deleted, even by users with full administrative permissions. When enabled:

- The table cannot be deleted using the AWS CLI, AWS Console, or any AWS SDK
- The table cannot be deleted through Infrastructure as Code (CloudFormation, Terraform, etc.)
- The table cannot be deleted through AWS Lambda functions or other AWS services

## Current Protected Tables

The following production tables are currently protected:

| Table Name                            | Purpose                 | Protection Status |
| ------------------------------------- | ----------------------- | ----------------- |
| `Tt3Production-EntitySettingsTable-*` | Entity settings storage | ✅ Protected      |
| `Tt3Production-EntityTable-*`         | Entity data storage     | ✅ Protected      |
| `Tt3Production-InvitationTable-*`     | User invitations        | ✅ Protected      |
| `Tt3Production-LeaveRequestTable-*`   | Leave request data      | ✅ Protected      |
| `Tt3Production-LeaveTable-*`          | Leave data storage      | ✅ Protected      |
| `Tt3Production-NextAuthTable-*`       | Authentication data     | ✅ Protected      |
| `Tt3Production-PermissionTable-*`     | User permissions        | ✅ Protected      |
| `Tt3Production-ShiftPositionsTable-*` | Shift position data     | ✅ Protected      |

## Management Script

The `protect-production-tables.sh` script provides a convenient way to manage deletion protection on production tables.

### Prerequisites

- AWS CLI installed and configured
- AWS credentials with permissions to modify DynamoDB tables
- Access to the AWS account where the tables are located

### Usage

```bash
# Check the status of all production tables
./scripts/protect-production-tables.sh status

# List all production tables
./scripts/protect-production-tables.sh list

# Enable deletion protection on all production tables
./scripts/protect-production-tables.sh protect

# Enable deletion protection on a specific table
./scripts/protect-production-tables.sh protect-table TABLE_NAME

# Disable deletion protection on a specific table (use with caution!)
./scripts/protect-production-tables.sh unprotect-table TABLE_NAME

# Show help
./scripts/protect-production-tables.sh help
```

### Examples

```bash
# Check current protection status
./scripts/protect-production-tables.sh status

# Protect a specific table
./scripts/protect-production-tables.sh protect-table Tt3Production-EntityTable-1WIXEZTUMERWF

# Protect all production tables (useful for new deployments)
./scripts/protect-production-tables.sh protect
```

## Manual AWS CLI Commands

If you prefer to use AWS CLI directly, here are the key commands:

### Enable Deletion Protection

```bash
aws dynamodb update-table \
  --table-name "Tt3Production-EntityTable-1WIXEZTUMERWF" \
  --deletion-protection-enabled
```

### Disable Deletion Protection

```bash
aws dynamodb update-table \
  --table-name "Tt3Production-EntityTable-1WIXEZTUMERWF" \
  --deletion-protection-disabled
```

### Check Protection Status

```bash
aws dynamodb describe-table \
  --table-name "Tt3Production-EntityTable-1WIXEZTUMERWF" \
  --query "Table.DeletionProtectionEnabled" \
  --output text
```

### List All Production Tables

```bash
aws dynamodb list-tables \
  --query "TableNames[?starts_with(@, 'Tt3Prod')]" \
  --output table
```

## When to Use

### Enable Deletion Protection When:

- Deploying to production
- Setting up new production tables
- After confirming a table is in production use
- As part of production environment setup

### Disable Deletion Protection When:

- **NEVER** for production tables in active use
- Only during planned maintenance windows
- Only when you have a specific, approved reason
- Only when you have a backup and recovery plan

## Security Considerations

1. **Access Control**: Ensure only authorized personnel can disable deletion protection
2. **Audit Logging**: All changes to deletion protection are logged in AWS CloudTrail
3. **Backup Strategy**: Maintain regular backups even with deletion protection enabled
4. **Recovery Plan**: Have a documented recovery procedure in case protection needs to be temporarily disabled

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure your AWS user/role has `dynamodb:UpdateTable` permission
2. **Table Not Found**: Verify the table name and AWS region
3. **Protection Already Enabled**: The script will handle this gracefully

### Error Messages

- `AccessDenied`: Check AWS permissions
- `ResourceNotFoundException`: Verify table name and region
- `ValidationException`: Check AWS CLI version and command syntax

## Best Practices

1. **Always verify** table names before making changes
2. **Test commands** on non-production tables first
3. **Document changes** in your deployment logs
4. **Regular audits** of protection status
5. **Team training** on proper usage of these scripts

## Emergency Procedures

In case of emergency where deletion protection must be disabled:

1. **Document the reason** for disabling protection
2. **Notify stakeholders** before making changes
3. **Have a backup** of the table data
4. **Re-enable protection** immediately after the emergency
5. **Review and update** procedures to prevent future emergencies

## Support

For questions or issues with table protection:

1. Check this documentation first
2. Review AWS DynamoDB documentation on deletion protection
3. Contact your AWS administrator or DevOps team
4. Review AWS CloudTrail logs for audit information

---

**Remember**: Deletion protection is a critical safety feature. Always think twice before disabling it on production tables!
