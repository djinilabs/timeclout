# TimeHaupt Permission & Authorization System

## Overview

TimeHaupt implements a sophisticated **Resource-Based Access Control (RBAC)** system that provides granular permissions across all organizational entities. This document explains how the permission system works, how to implement authorization checks, and best practices for security.

## 📦 Imports

```typescript
import { PERMISSION_LEVELS } from "@/tables";
```

## 🏗️ Architecture Overview

### Design Principles

- **Resource-Centric**: Permissions are tied to specific resources (companies, units, teams)
- **Hierarchical Inheritance**: Permissions can cascade down the organizational structure
- **User-Specific**: Each user has individual permission records for each resource
- **Audit Trail**: Complete tracking of who granted what permissions and when
- **Multi-Tenant**: Companies are completely isolated from each other

### Core Components

1. **Permission Table**: Stores all user permissions
2. **Authorization Functions**: Business logic for checking permissions
3. **GraphQL Middleware**: Automatic permission enforcement
4. **Resource References**: Consistent identification system

## 🔐 Permission Levels

### Level Definitions

| Level | Name      | Description           | Capabilities                                   |
| ----- | --------- | --------------------- | ---------------------------------------------- |
| **1** | **READ**  | Basic read access     | View data, no modifications                    |
| **2** | **WRITE** | Complete write access | Full CRUD operations                           |
| **3** | **OWNER** | Full control          | Delete, transfer ownership, manage permissions |

### Business Context Examples

#### Company Level (Level 2-3)

- **Level 2**: Can manage company settings, create units, invite users
- **Level 3**: Can delete company, transfer ownership, manage all permissions

#### Unit Level (Level 2-3)

- **Level 2**: Can create teams, manage unit settings
- **Level 3**: Can manage unit permissions, delete unit

#### Team Level (Level 2-3)

- **Level 2**: Can create shifts, manage team schedule
- **Level 3**: Can manage team members, team settings

#### User Level (Level 1-2)

- **Level 1**: Can view user profile, leave requests
- **Level 2**: Can update own profile, create leave requests

## 🗄️ Permission Table Structure

### Database Schema

```typescript
interface PermissionRecord {
  pk: string; // Resource being accessed (e.g., "companies/acme-corp")
  sk: string; // User requesting access (e.g., "users/john@acme.com")
  resourceType: string; // Type of resource ("companies", "units", "teams")
  parentPk?: string; // Parent resource reference
  type: number; // Permission level (1-3)
  version: number; // Version number for optimistic locking
  createdAt: string; // ISO timestamp
  createdBy: string; // Grantor's resource reference
  updatedAt?: string; // Last modification timestamp
  updatedBy?: string; // Last modifier's resource reference
}
```

### Example Records

```
pk: "companies/acme-corp"
sk: "users/admin@acme.com"
resourceType: "companies"
type: 3
createdAt: "2024-01-01T00:00:00Z"
createdBy: "users/admin@acme.com"

pk: "companies/acme-corp/units/engineering"
sk: "users/manager@acme.com"
resourceType: "units"
parentPk: "companies/acme-corp"
type: 3
createdAt: "2024-01-01T00:00:00Z"
createdBy: "users/admin@acme.com"

pk: "companies/acme-corp/units/engineering/teams/frontend"
sk: "users/developer@acme.com"
resourceType: "teams"
parentPk: "companies/acme-corp/units/engineering"
type: 2
createdAt: "2024-01-01T00:00:00Z"
createdBy: "users/manager@acme.com"
```

## 🔍 Authorization Functions

### Core Authorization Functions

#### 1. `isUserAuthorized`

**Purpose**: Check if a user has a specific permission level on a resource

```typescript
export type IsUserAuthorizedResult =
  | [false]
  | [true, ResourceRef<"users">, number];

export const isUserAuthorized = async (
  userPk: ResourceRef<"users">,
  resource: ResourceRef,
  minimumPermission: number
): Promise<IsUserAuthorizedResult> => {
  const { permission } = await database();
  const permissionRecord = await permission.get(resource, userPk);

  if (!permissionRecord || permissionRecord.type < minimumPermission) {
    return [false];
  }

  return [true, userPk, permissionRecord.type];
};
```

**Usage**:

```typescript
const [authorized, userPk, actualLevel] = await isUserAuthorized(
  userRef,
  resourceRef,
  minimumPermission
);

if (!authorized) {
  throw forbidden("Insufficient permissions");
}
```

#### 2. `ensureAuthorization`

**Purpose**: Grant or update permissions for a user

```typescript
export const ensureAuthorization = async (
  resource: string,
  to: string,
  level: number,
  givenBy: string,
  parent?: string
) => {
  const { permission } = await database();
  const userPermission = await permission.get(resource, to);

  if (userPermission != null) {
    if (userPermission.type < level) {
      userPermission.type = level;
      await permission.update(userPermission);
    }
  } else {
    await giveAuthorization(resource, to, level, givenBy, parent);
  }
};
```

**Usage**:

```typescript
// Grant admin access to a team
await ensureAuthorization(
  "companies/acme-corp/units/engineering/teams/frontend",
  "users/manager@acme.com",
  4, // Admin level
  "users/admin@acme.com",
  "companies/acme-corp/units/engineering"
);
```

#### 3. `ensureExactAuthorization`

**Purpose**: Set exact permission level (overwrites existing)

```typescript
export const ensureExactAuthorization = async (
  resource: string,
  to: string,
  level: number,
  givenBy: string,
  parent?: string
) => {
  const { permission } = await database();
  const userPermission = await permission.get(resource, to);

  if (userPermission != null) {
    if (userPermission.type !== level) {
      userPermission.type = level;
      await permission.update(userPermission);
    }
  } else {
    await giveAuthorization(resource, to, level, givenBy, parent);
  }
};
```

#### 4. `getUserAuthorizationLevelForResource`

**Purpose**: Get the specific permission level a user has on a resource

```typescript
export const getUserAuthorizationLevelForResource = async (
  resource: ResourceRef,
  userPk: ResourceRef<"users">
): Promise<number | null> => {
  const { permission } = await database();
  const permissionRecord = await permission.get(resource, userPk);

  if (!permissionRecord) {
    return null;
  }

  return permissionRecord.type;
};
```

## 🚪 GraphQL Integration

### Automatic Permission Enforcement

The GraphQL layer automatically enforces permissions using middleware:

#### 1. `ensureAuthorized` Middleware

```typescript
export const ensureAuthorized = async (
  ctx: ResolverContext,
  resource: ResourceRef,
  minimumPermission: number
): Promise<ResourceRef<"users">> => {
  const [authorized, userPk] = await isAuthorized(
    ctx,
    resource,
    minimumPermission
  );

  if (!authorized) {
    console.trace(
      `User does not have permission of level ${minimumPermission} to access this resource (${resource})`
    );
    throw forbidden(
      i18n.t(
        "User does not have permission of level {minimumPermission} to access this resource ({resource})",
        { minimumPermission, resource }
      )
    );
  }

  return userPk;
};
```

#### 2. Resolver Usage

```typescript
export const Company: CompanyResolvers = {
  units: async (parent, _args, ctx) => {
    // Check if user can access units in this company
    await ensureAuthorized(ctx, parent.pk, PERMISSION_LEVELS.READ);

    const { entity } = await database();
    const permissions = await getAuthorized(ctx, "units");

    return (await entity.batchGet(permissions.map((p) => p.pk))).filter(
      (u) => (u as unknown as EntityRecord).parentPk === parent.pk
    );
  },

  resourcePermission: async (parent, _, ctx) => {
    const session = await requireSession(ctx);
    return session.user?.id
      ? getUserAuthorizationLevelForResource(
          resourceRef("companies", parent.pk),
          resourceRef("users", session.user.id)
        )
      : null;
  },
};
```

### Permission Checking Patterns

#### 1. **Read Operations** (Level 1)

```typescript
// Check read access
await ensureAuthorized(ctx, resourceRef, PERMISSION_LEVELS.READ);

// Proceed with read operation
const data = await fetchData(resourceRef);
```

#### 2. **Write Operations** (Level 2-3)

```typescript
// Check write access
await ensureAuthorized(ctx, resourceRef, PERMISSION_LEVELS.WRITE);

// Proceed with write operation
const result = await updateData(resourceRef, updates);
```

#### 3. **Administrative Operations** (Level 3)

```typescript
// Check owner access
await ensureAuthorized(ctx, resourceRef, PERMISSION_LEVELS.OWNER);

// Proceed with admin operation
await managePermissions(resourceRef, userId, newLevel);
```

## 🔗 Permission Inheritance

### Hierarchical Structure

Permissions can cascade down the organizational hierarchy:

```
Company (Level 3)
├── Units (Level 3)
│   ├── Teams (Level 2)
│   │   └── Members (Level 2)
│   └── Settings (Level 3)
├── Users (Level 1-2)
└── Settings (Level 3)
```

### Inheritance Rules

1. **Explicit Permissions**: Direct permissions take precedence
2. **Parent Access**: Users with company access can see child entities
3. **No Automatic Inheritance**: Permissions must be explicitly granted
4. **Granular Control**: Each level can have different permission sets

### Example Inheritance

```typescript
// User has company-level access
await ensureAuthorization(
  "companies/acme-corp",
  "users/manager@acme.com",
  PERMISSION_LEVELS.OWNER, // Owner level
  "users/admin@acme.com"
);

// User can now see all units, but needs explicit permissions for write access
const units = await getAuthorized(ctx, "units"); // ✅ Can read

// But cannot modify without explicit unit permission
await ensureAuthorized(ctx, "companies/acme-corp/units/engineering", 3); // ❌ Fails
```

## 🛡️ Security Features

### Data Isolation

- **Company Boundaries**: Users cannot access data from other companies
- **Resource Scoping**: Permissions are scoped to specific resources
- **Audit Logging**: All permission changes are tracked
- **Session Validation**: Permissions are checked on every request

### Permission Validation

```typescript
// Validate permission before granting
const canGrantPermission = async (
  granter: ResourceRef<"users">,
  resource: ResourceRef,
  level: number
) => {
  const granterLevel = await getUserAuthorizationLevelForResource(
    resource,
    granter
  );

  // Users can only grant permissions up to their own level
  if (!granterLevel || granterLevel < level) {
    throw forbidden("Cannot grant permission higher than your own level");
  }

  // Users cannot grant permissions higher than their own
  if (granterLevel < level) {
    throw forbidden("Cannot grant permission higher than your own level");
  }

  return true;
};
```

### Security Best Practices

1. **Principle of Least Privilege**: Grant minimum necessary permissions
2. **Regular Audits**: Review permissions periodically
3. **Permission Expiration**: Consider time-limited permissions for sensitive operations
4. **Multi-Factor Authentication**: Require MFA for high-level permissions
5. **Logging**: Log all permission changes and access attempts

## 📊 Permission Queries

### Common Query Patterns

#### 1. **Find User's Resources**

```typescript
// Find all teams a user has access to
const permissions = await permission.query({
  IndexName: "byResourceTypeAndEntityId",
  KeyConditionExpression: "resourceType = :resourceType AND sk = :userRef",
  ExpressionAttributeValues: {
    ":resourceType": "teams",
    ":userRef": userRef,
  },
});

const teamRefs = permissions.map((p) => p.pk);
const teams = await entity.batchGet(teamRefs);
```

#### 2. **Find Resource Members**

```typescript
// Find all users with access to a specific team
const permissions = await permission.query({
  KeyConditionExpression: "pk = :teamPk",
  ExpressionAttributeValues: { ":teamPk": teamPk },
});

const userRefs = permissions
  .filter((p) => p.sk.startsWith("users/"))
  .map((p) => p.sk);

const users = await entity.batchGet(userRefs);
```

#### 3. **Permission Level Analysis**

```typescript
// Analyze permission distribution
const permissions = await permission.query({
  KeyConditionExpression: "pk = :resourcePk",
  ExpressionAttributeValues: { ":resourcePk": resourcePk },
});

const levelCounts = permissions.reduce((acc, p) => {
  acc[p.type] = (acc[p.type] || 0) + 1;
  return acc;
}, {} as Record<number, number>);

// levelCounts: { 1: 5, 2: 3, 3: 1 }
```

## 🧪 Testing Permissions

### Test Data Setup

```typescript
// Create test company
const testCompany = await entity.create({
  pk: "companies/test-company",
  name: "Test Company",
  version: 1,
  createdAt: new Date().toISOString(),
});

// Create test users
const adminUser = await entity.create({
  pk: "users/admin@test.com",
  name: "Admin User",
  email: "admin@test.com",
  version: 1,
  createdAt: new Date().toISOString(),
});

const regularUser = await entity.create({
  pk: "users/user@test.com",
  name: "Regular User",
  email: "user@test.com",
  version: 1,
  createdAt: new Date().toISOString(),
});

// Grant permissions
await ensureAuthorization(
  "companies/test-company",
  "users/admin@test.com",
  PERMISSION_LEVELS.OWNER, // Owner
  "users/admin@test.com"
);

await ensureAuthorization(
  "companies/test-company",
  "users/user@test.com",
  PERMISSION_LEVELS.READ, // Read only
  "users/admin@test.com"
);
```

### Permission Testing

```typescript
describe("Permission System", () => {
  it("should allow admin to access company", async () => {
    const [authorized] = await isUserAuthorized(
      "users/admin@test.com",
      "companies/test-company",
      PERMISSION_LEVELS.OWNER
    );
    expect(authorized).toBe(true);
  });

  it("should deny regular user admin access", async () => {
    const [authorized] = await isUserAuthorized(
      "users/user@test.com",
      "companies/test-company",
      PERMISSION_LEVELS.OWNER
    );
    expect(authorized).toBe(false);
  });

  it("should allow regular user read access", async () => {
    const [authorized] = await isUserAuthorized(
      "users/user@test.com",
      "companies/test-company",
      PERMISSION_LEVELS.READ
    );
    expect(authorized).toBe(true);
  });
});
```

## 📚 Related Documentation

- [Database Schema](./database-schema.md) - Permission table structure
- [GraphQL Resolvers](./graphql-resolvers.md) - Authorization middleware
- [Security & Compliance](./security-compliance.md) - Security best practices

## 🤝 Contributing to the Permission System

### Modifying Authorization Logic

1. **Backward Compatibility**: Ensure existing permissions continue to work
2. **Performance Impact**: Consider query performance implications
3. **Security Review**: Validate security implications of changes
4. **Testing**: Thorough testing of all permission scenarios

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Maintainer**: Development Team
