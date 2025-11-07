# TimeClout Database Schema & Data Model

## Overview

TimeClout uses AWS DynamoDB as its primary database, with a sophisticated data model that supports hierarchical organizations, versioning, and complex relationships. This document explains the database schema, data structures, and how the system manages relationships between entities.

## 🏗️ Architecture Overview

### Database Technology

- **Primary Database**: AWS DynamoDB
- **Schema Validation**: Zod schemas for type safety
- **Versioning**: Draft/publish system with version control
- **Encryption**: All data encrypted at rest
- **Backup**: Production tables protected with deletion protection

### Design Principles

- **Hierarchical Structure**: Companies → Units → Teams → Users
- **Resource References**: Consistent identification system
- **Flexible Schema**: JSON-based settings and metadata
- **Audit Trail**: Complete creation and modification tracking
- **Multi-tenancy**: Support for multiple organizations

## 📊 Core Tables

### 1. Entity Table

**Purpose**: Stores all organizational entities (companies, units, teams, users)

**Key Structure**:

```typescript
interface EntityRecord {
  pk: string; // Resource reference (e.g., "companies/123")
  name: string; // Display name
  parentPk?: string; // Parent entity reference
  email?: string; // Email (for users)
  version: number; // Version number
  createdAt: string; // ISO timestamp
  createdBy?: string; // Creator's resource reference
  updatedAt?: string; // Last modification timestamp
  updatedBy?: string; // Last modifier's resource reference
}
```

**Example Records**:

```
pk: "companies/acme-corp"
name: "ACME Corporation"
version: 1
createdAt: "2024-01-01T00:00:00Z"
createdBy: "users/admin@acme.com"

pk: "companies/acme-corp/units/engineering"
name: "Engineering Department"
parentPk: "companies/acme-corp"
version: 1
createdAt: "2024-01-01T00:00:00Z"
createdBy: "users/admin@acme.com"

pk: "companies/acme-corp/units/engineering/teams/frontend"
name: "Frontend Team"
parentPk: "companies/acme-corp/units/engineering"
version: 1
createdAt: "2024-01-01T00:00:00Z"
createdBy: "users/admin@acme.com"

pk: "users/john.doe@acme.com"
name: "John Doe"
email: "john.doe@acme.com"
version: 1
createdAt: "2024-01-01T00:00:00Z"
createdBy: "users/admin@acme.com"
```

### 2. Entity Settings Table

**Purpose**: Stores configurable settings for entities

**Key Structure**:

```typescript
interface EntitySettingsRecord {
  pk: string; // Entity reference
  sk: string; // Setting name
  settings: any; // Setting value (JSON)
  version: number; // Version number
  createdAt: string; // ISO timestamp
  createdBy?: string; // Creator's resource reference
  updatedAt?: string; // Last modification timestamp
  updatedBy?: string; // Last modifier's resource reference
}
```

**Example Records**:

```
pk: "companies/acme-corp"
sk: "work-schedule"
settings: {
  "defaultStartTime": "09:00",
  "defaultEndTime": "17:00",
  "timezone": "America/New_York"
}

pk: "companies/acme-corp/units/engineering"
sk: "leave-policies"
settings: {
  "annualLeaveDays": 25,
  "sickLeaveDays": 10,
  "approvalRequired": true
}
```

### 3. Permission Table

**Purpose**: Manages access control and permissions

**Key Structure**:

```typescript
interface PermissionRecord {
  pk: string; // Resource being accessed
  sk: string; // User requesting access
  resourceType: string; // Type of resource (companies, units, teams)
  parentPk?: string; // Parent resource reference
  type: number; // Permission level (1-5)
  version: number; // Version number
  createdAt: string; // ISO timestamp
  createdBy: string; // Grantor's resource reference
  updatedAt?: string; // Last modification timestamp
  updatedBy?: string; // Last modifier's resource reference
}
```

**Permission Levels**:

- **Level 1**: Read access
- **Level 2**: Basic write access
- **Level 3**: Full write access
- **Level 4**: Administrative access
- **Level 5**: Owner access

**Example Records**:

```
pk: "companies/acme-corp"
sk: "users/john.doe@acme.com"
resourceType: "companies"
type: 4
createdAt: "2024-01-01T00:00:00Z"
createdBy: "users/admin@acme.com"

pk: "companies/acme-corp/units/engineering"
sk: "users/jane.smith@acme.com"
resourceType: "units"
parentPk: "companies/acme-corp"
type: 3
createdAt: "2024-01-01T00:00:00Z"
createdBy: "users/admin@acme.com"
```

### 4. Shift Positions Table

**Purpose**: Stores shift assignments and scheduling data

**Key Structure**:

```typescript
interface ShiftPositionRecord {
  pk: string; // Team reference
  sk: string; // Day + unique identifier
  teamPk: string; // Team reference
  day: string; // Date (YYYY-MM-DD)
  name?: string; // Shift name
  color?: string; // Display color
  requiredSkills: string[]; // Required qualifications
  schedules: ShiftSchedule[]; // Work hours and inconvenience
  assignedTo?: string; // Assigned worker reference
  version: number; // Version number
  createdAt: string; // ISO timestamp
  createdBy?: string; // Creator's resource reference
  updatedAt?: string; // Last modification timestamp
  updatedBy?: string; // Last modifier's resource reference
}

interface ShiftSchedule {
  startHourMinutes: number[]; // Start times in minutes
  endHourMinutes: number[]; // End times in minutes
  inconveniencePerHour: number; // Inconvenience multiplier
}
```

**Example Records**:

```
pk: "companies/acme-corp/units/engineering/teams/frontend"
sk: "2024-03-15/abc123"
teamPk: "companies/acme-corp/units/engineering/teams/frontend"
day: "2024-03-15"
name: "Morning Shift"
color: "#3B82F6"
requiredSkills: ["frontend", "react"]
schedules: [{
  "startHourMinutes": [540],     // 9:00 AM
  "endHourMinutes": [1020],      // 5:00 PM
  "inconveniencePerHour": 1.0
}]
assignedTo: "users/john.doe@acme.com"
```

### 5. Leave Request Table

**Purpose**: Manages time-off requests and approvals

**Key Structure**:

```typescript
interface LeaveRequestRecord {
  pk: string; // Company + User reference
  sk: string; // Start/End/Type identifier
  startDate: string; // Start date (YYYY-MM-DD)
  endDate: string; // End date (YYYY-MM-DD)
  companyPk?: string; // Company reference
  userPk?: string; // User reference
  type: string; // Leave type
  reason?: string; // Reason for leave
  approved?: boolean; // Approval status
  approvedBy?: string[]; // Approver references
  approvedAt?: string[]; // Approval timestamps
  version: number; // Version number
  createdAt: string; // ISO timestamp
  createdBy: string; // Creator's resource reference
  updatedAt?: string; // Last modification timestamp
  updatedBy?: string; // Last modifier's resource reference
}
```

**Example Records**:

```
pk: "companies/acme-corp/users/john.doe@acme.com"
sk: "2024-06-15/2024-06-20/vacation"
startDate: "2024-06-15"
endDate: "2024-06-20"
companyPk: "companies/acme-corp"
userPk: "users/john.doe@acme.com"
type: "vacation"
reason: "Summer vacation with family"
approved: true
approvedBy: ["users/manager@acme.com"]
approvedAt: ["2024-05-01T10:00:00Z"]
```

### 6. Leave Table

**Purpose**: Stores actual leave days taken

**Key Structure**:

```typescript
interface LeaveRecord {
  pk: string; // Company + User reference
  sk: string; // Date
  leaveRequestPk: string; // Associated leave request
  leaveRequestSk: string; // Leave request identifier
  type: string; // Leave type
  version: number; // Version number
  createdAt: string; // ISO timestamp
  createdBy?: string; // Creator's resource reference
  updatedAt?: string; // Last modification timestamp
  updatedBy?: string; // Last modifier's resource reference
}
```

### 7. Invitation Table

**Purpose**: Manages team member invitations

**Key Structure**:

```typescript
interface InvitationRecord {
  pk: string; // Invitation entity reference
  sk: string; // Invitee email
  permissionType: number; // Permission level to grant
  secret: string; // Invitation secret/token
  version: number; // Version number
  createdAt: string; // ISO timestamp
  createdBy: string; // Creator's resource reference
  updatedAt?: string; // Last modification timestamp
  updatedBy?: string; // Last modifier's resource reference
}
```

### 8. NextAuth Table

**Purpose**: Authentication and session management

**Key Structure**:

```typescript
interface NextAuthRecord {
  pk: string; // User identifier
  sk: string; // Session/account identifier
  email: string; // User email
  name?: string; // Display name
  emailVerified?: string; // Email verification timestamp
  image?: string; // Profile image URL
  id: string; // Unique identifier
  version: number; // Version number
  createdAt: string; // ISO timestamp
}
```

## 🔗 Resource Reference System

### Reference Format

TimeClout uses a hierarchical resource reference system:

```
{resourceType}/{identifier}[/{subResourceType}/{subIdentifier}...]
```

### Common Patterns

- **Companies**: `companies/{companyId}`
- **Units**: `companies/{companyId}/units/{unitId}`
- **Teams**: `companies/{companyId}/units/{unitId}/teams/{teamId}`
- **Users**: `users/{email}`
- **Shift Positions**: `companies/{companyId}/units/{unitId}/teams/{teamId}`

### Reference Functions

```typescript
// Create resource references
const companyRef = resourceRef("companies", "acme-corp");
// Returns: "companies/acme-corp"

const unitRef = resourceRef("companies", "acme-corp", "units", "engineering");
// Returns: "companies/acme-corp/units/engineering"

const teamRef = resourceRef(
  "companies",
  "acme-corp",
  "units",
  "engineering",
  "teams",
  "frontend"
);
// Returns: "companies/acme-corp/units/engineering/teams/frontend"

// Parse existing references
const parsed = getResourceRef("companies/acme-corp/units/engineering");
// Returns: { resourceType: "companies", identifier: "acme-corp", subResourceType: "units", subIdentifier: "engineering" }
```

## 📝 Versioning System

### Draft/Publish Workflow

TimeClout supports a sophisticated versioning system:

1. **Draft Creation**: New versions start as drafts
2. **Validation**: Drafts are validated against business rules
3. **Publishing**: Drafts can be published to become active
4. **Rollback**: Previous versions can be restored

### Version Management

```typescript
interface VersionedRecord {
  version: number; // Current version number
  userVersion?: string; // User-visible version identifier
  userVersions?: Record<
    string,
    {
      deleted?: boolean; // Marked for deletion
      createdAt?: string; // Creation timestamp
      createdBy?: string; // Creator reference
      updatedAt?: string; // Last modification
      updatedBy?: string; // Last modifier
      newProps?: Record<string, unknown>; // New properties
    }
  >;
}
```

### Concurrent Update Handling

TimeClout uses **optimistic locking** with the `version` attribute to handle concurrent updates:

#### How It Works

1. **Read**: Fetch record with current version number
2. **Modify**: Make changes to the record
3. **Update**: Submit update with expected version number
4. **Validation**: DynamoDB checks if version matches current
5. **Success/Failure**: Update succeeds only if versions match

#### Example Flow

```typescript
// User A reads record
const recordA = await entity.get("companies/acme-corp");
// recordA.version = 5

// User B reads the same record
const recordB = await entity.get("companies/acme-corp");
// recordB.version = 5

// User A updates (succeeds)
await entity.update({
  ...recordA,
  name: "ACME Corp Updated",
  version: 5, // Expected version
});
// New version becomes 6

// User B tries to update (fails)
try {
  await entity.update({
    ...recordB,
    name: "ACME Corp Modified",
    version: 5, // Stale version - will fail
  });
} catch (error) {
  // Update fails due to version mismatch
  // User B needs to re-read and retry
}
```

#### Benefits

- **Prevents Data Loss**: Concurrent updates don't overwrite each other
- **Performance**: No database-level locks required
- **Scalability**: Works well in distributed systems
- **User Experience**: Clear feedback when conflicts occur

#### Best Practices

```typescript
// Always handle version conflicts gracefully
const updateWithRetry = async (pk: string, updates: Partial<EntityRecord>) => {
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      const current = await entity.get(pk);
      const updated = await entity.update({
        ...current,
        ...updates,
        version: current.version,
      });
      return updated;
    } catch (error) {
      if (error.message.includes("version")) {
        retries++;
        if (retries >= maxRetries) {
          throw new Error(
            "Update failed after retries - please refresh and try again"
          );
        }
        // Wait briefly before retry
        await new Promise((resolve) => setTimeout(resolve, 100 * retries));
      } else {
        throw error; // Non-version error, don't retry
      }
    }
  }
};
```

## 🗂️ Indexing Strategy

### Primary Indexes

- **Partition Key (pk)**: Resource reference
- **Sort Key (sk)**: Entity-specific identifier

### Global Secondary Indexes (GSI)

#### Permission Table

- **byResourceTypeAndEntityId**: `resourceType` + `sk` (user)
  - Purpose: Find all resources a user has access to
  - Use case: User permission queries

#### Invitation Table

- **bySecret**: `secret` + `sk` (email)
  - Purpose: Find invitations by secret token
  - Use case: Invitation acceptance

#### Leave Request Table

- **byPkAndStartDate**: `pk` + `startDate`

  - Purpose: Find leave requests by date range
  - Use case: Calendar views

- **byCompanyPk**: `companyPk` + `sk`
  - Purpose: Find all leave requests for a company
  - Use case: Company-wide leave management

#### Entity Table

- **byParentPk**: `parentPk` + `sk`
  - Purpose: Find child entities by parent
  - Use case: Company units, team members

#### NextAuth Table

- **GSI1**: `pk` + `sk`
  - Purpose: Authentication session management
  - Use case: User sessions and accounts

## 🔐 Security & Encryption

### Data Protection

- **Encryption at Rest**: All data encrypted using AWS KMS
- **Access Control**: Row-level permissions via permission table
- **Audit Trail**: Complete creation and modification tracking
- **Resource Isolation**: Companies cannot access each other's data

### Permission Model

```typescript
// Check user permission
const [authorized, userPk, permissionLevel] = await isUserAuthorized(
  userRef,
  resourceRef,
  minimumPermission
);

// Grant permission
await ensureAuthorization(resource, userRef, permissionLevel, grantedBy);
```

## 📊 Data Relationships

### Hierarchical Structure

```
Company
├── Units
│   ├── Teams
│   │   ├── Members (Users)
│   │   └── Shift Positions
│   └── Settings
├── Users
├── Leave Requests
└── Settings
```

### Relationship Examples

#### Company to Units

```typescript
// Find all units in a company
const units = await entity.query({
  IndexName: "byParentPk",
  KeyConditionExpression: "parentPk = :companyPk",
  ExpressionAttributeValues: { ":companyPk": companyPk },
});
```

#### Team to Members

```typescript
// Find all team members
const permissions = await permission.query({
  KeyConditionExpression: "pk = :teamPk",
  ExpressionAttributeValues: { ":teamPk": teamPk },
});

const memberRefs = permissions
  .filter((p) => p.sk.startsWith("users/"))
  .map((p) => p.sk);

const members = await entity.batchGet(memberRefs);
```

#### User to Permissions

```typescript
// Find all resources a user can access
const permissions = await permission.query({
  IndexName: "byResourceTypeAndEntityId",
  KeyConditionExpression: "resourceType = :resourceType AND sk = :userRef",
  ExpressionAttributeValues: {
    ":resourceType": "teams",
    ":userRef": userRef,
  },
});
```

## 🚀 Performance Considerations

### Query Optimization

- **Batch Operations**: Use `batchGet` for multiple items
- **Index Selection**: Choose appropriate GSI for query patterns
- **Pagination**: Handle large result sets efficiently
- **Caching**: Implement application-level caching for frequently accessed data

### Best Practices

```typescript
// Good: Use batch operations
const users = await entity.batchGet(userRefs);

// Good: Use appropriate indexes
const permissions = await permission.query({
  IndexName: "byResourceTypeAndEntityId",
  KeyConditionExpression: "resourceType = :type AND sk = :user",
  ExpressionAttributeValues: { ":type": "teams", ":user": userRef },
});

// Avoid: Scanning large tables
const allEntities = await entity.scan(); // ❌ Expensive
```

## 🧪 Testing & Development

### Test Data Setup

```typescript
// Create test company
const testCompany = await entity.create({
  pk: "companies/test-company",
  name: "Test Company",
  version: 1,
  createdAt: new Date().toISOString(),
});

// Create test user
const testUser = await entity.create({
  pk: "users/test@example.com",
  name: "Test User",
  email: "test@example.com",
  version: 1,
  createdAt: new Date().toISOString(),
});
```

### Schema Validation

```typescript
// Validate data against schema
const schema = tableSchemas.entity;
const validated = schema.parse(data);

// Handle validation errors
try {
  const validated = schema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Validation failed:", error.errors);
  }
}
```

## 🔧 Database Operations

### CRUD Operations

```typescript
// Create
const newEntity = await entity.create({
  pk: "companies/new-company",
  name: "New Company",
  version: 1,
  createdAt: new Date().toISOString(),
});

// Read
const entity = await entity.get("companies/existing-company");

// Update
const updated = await entity.update({
  ...existing,
  name: "Updated Name",
});

// Delete
await entity.delete("companies/company-to-delete");
```

### Version Management

```typescript
// Create new version
const newVersion = await entity.create({
  ...existing,
  version: existing.version + 1,
  userVersion: "v2.0",
  createdAt: new Date().toISOString(),
});

// Publish version
await entity.upsert(newVersion, newVersion.version.toString());

// Revert to previous version
const previous = await entity.revert(pk, sk, previousVersion.toString());
```

## 🚨 Common Issues & Solutions

### Issue: Permission Denied

**Cause**: User lacks required permission level
**Solution**: Check permission table and grant appropriate access

### Issue: Resource Not Found

**Cause**: Incorrect resource reference format
**Solution**: Verify reference format and use `getResourceRef` helper

### Issue: Version Conflicts

**Cause**: Concurrent modifications to same resource
**Solution**: Implement optimistic locking or retry logic

### Issue: Query Performance

**Cause**: Missing or inappropriate indexes
**Solution**: Review query patterns and add necessary GSIs

## 📚 Related Documentation

- [GraphQL Resolvers](./graphql-resolvers.md) - How data is exposed via API
- [Permission System](./permission-system.md) - Access control and security
- [Production Table Protection](./../operations/production-table-protection.md) - Database safety measures

## 🤝 Contributing to the Schema

### Adding New Tables

1. Define Zod schema in `libs/tables/src/schema.ts`
2. Add to `TableSchemas` type
3. Update `DatabaseSchema` interface
4. Add comprehensive tests
5. Update this documentation

### Modifying Existing Tables

1. Consider backward compatibility
2. Update schema validation
3. Migrate existing data if needed
4. Update related queries and resolvers
5. Test thoroughly

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Maintainer**: Development Team
