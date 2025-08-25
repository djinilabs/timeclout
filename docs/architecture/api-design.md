# TT3 API Design & GraphQL Schema

## Overview

TT3 exposes a comprehensive GraphQL API that provides type-safe access to all business operations. The API is built with performance, security, and developer experience in mind, featuring automatic code generation, user caching, and comprehensive authorization controls.

## 🏗️ Architecture Overview

### Technology Stack

- **GraphQL Server**: GraphQL Yoga with Express integration
- **Code Generation**: Automatic TypeScript types and resolver generation
- **Authentication**: NextAuth.js with DynamoDB adapter
- **Authorization**: Resource-based access control (RBAC)
- **Performance**: Request-scoped user caching
- **Internationalization**: Multi-language support via Lingui

### Design Principles

- **Type Safety First**: Full TypeScript support with generated types
- **Performance Optimized**: User caching and efficient data fetching
- **Security by Default**: Authentication and authorization on every request
- **Developer Experience**: Auto-completion, validation, and clear error messages
- **Consistent Patterns**: Standardized resolver and middleware patterns

## 📊 GraphQL Schema Structure

### Schema Organization

The GraphQL schema is organized into logical modules:

```
libs/graphql/src/schema/
├── base/           # Base types and scalars
├── company/        # Company management
├── invitation/     # User invitations
├── leave/          # Leave management
├── leave_request/  # Leave request workflow
├── shift_position/ # Shift scheduling
├── team/          # Team management
├── unit/          # Unit management
└── user/          # User management
```

### Base Schema

```graphql
# libs/graphql/src/schema/base/schema.graphql
type Query
type Mutation

scalar DateTime
scalar Date
scalar JSON
```

### Core Types

#### Company

```graphql
type Company {
  pk: String!
  name: String!
  createdAt: DateTime!
  createdBy: User!
  updatedAt: DateTime
  updatedBy: User
  resourcePermission: Int
  settings(name: String!): JSON
  units: [Unit!]
}
```

#### User

```graphql
type User {
  pk: String!
  email: String!
  name: String!
  emailMd5: String!
  resourcePermission: Int
  resourcePermissionGivenAt: DateTime
  settings(name: String!): JSON
  createdAt: DateTime
  createdBy: User
  updatedAt: DateTime
  updatedBy: User
}
```

#### Team

```graphql
type Team {
  pk: String!
  name: String!
  companyPk: String!
  unitPk: String!
  createdAt: DateTime!
  createdBy: User!
  updatedAt: DateTime
  updatedBy: User
  resourcePermission: Int
  members(qualifications: [String!]): [User!]
  schedule(startDate: Date!, endDate: Date!): Schedule!
  approvedSchedule(startDate: Date!, endDate: Date!): Schedule!
  settings(name: String!): JSON
  teamMembersQualifications: [MemberQualifications!]!
}
```

#### ShiftPosition

```graphql
type ShiftPosition {
  pk: String!
  sk: String!
  day: String!
  name: String
  color: String
  requiredSkills: [String!]!
  schedules: [ShiftPositionSchedule!]!
  assignedTo: User
  userVersion: String
}

type ShiftPositionSchedule {
  startHourMinutes: [Int!]!
  endHourMinutes: [Int!]!
  inconveniencePerHour: Float!
}
```

## 🔐 Authentication & Authorization

### Authentication Flow

#### 1. Session Management

```typescript
// libs/graphql/src/session/getSession.ts
export const getSession = async (ctx: ResolverContext) => {
  const request = eventToRequest(ctx.event);
  return getExpressSession(request, await authConfig());
};
```

#### 2. Session Validation

```typescript
// libs/graphql/src/session/requireSession.ts
export const requireSession = async (ctx: ResolverContext) => {
  const session = await getSession(ctx);
  if (!session) {
    throw unauthorized();
  }
  return session;
};
```

#### 3. User Validation

```typescript
// libs/graphql/src/session/requireSessionUser.ts
export const requireSessionUser = async (ctx: ResolverContext) => {
  const session = await requireSession(ctx);
  if (!session.user?.id) {
    throw unauthorized();
  }
  const { entity } = await database();
  const user = await entity.get(resourceRef("users", session.user.id));
  if (!user) {
    throw unauthorized();
  }
  return user;
};
```

### Authorization System

#### Permission Levels

```typescript
// libs/tables/src/schema.ts
export const PERMISSION_LEVELS = {
  READ: 1, // View data
  WRITE: 2, // Create/update data
  OWNER: 3, // Full control including permissions
};
```

#### Authorization Middleware

```typescript
// libs/graphql/src/auth/ensureAuthorized.ts
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

#### Resolver Usage

```typescript
// Example: Company resolver with authorization
export const company: NonNullable<QueryResolvers["company"]> = async (
  _parent,
  arg,
  ctx
) => {
  // Check if user has READ access to this company
  await ensureAuthorized(
    ctx,
    resourceRef("companies", arg.companyPk),
    PERMISSION_LEVELS.READ
  );

  const { entity } = await database();
  const company = await entity.get(resourceRef("companies", arg.companyPk));
  if (!company) {
    throw notFound(i18n._("Company not found"));
  }
  return company as unknown as Company;
};
```

## 🚀 Resolver Patterns

### Standard Resolver Structure

#### 1. Query Resolvers

```typescript
export const resolverName: NonNullable<QueryResolvers["fieldName"]> = async (
  parent,
  args,
  ctx
) => {
  // 1. Authorization check
  await ensureAuthorized(ctx, resourceRef, PERMISSION_LEVELS.READ);

  // 2. Business logic
  const result = await businessLogic(args);

  // 3. Return typed result
  return result as unknown as ExpectedType;
};
```

#### 2. Mutation Resolvers

```typescript
export const mutationName: NonNullable<MutationResolvers["fieldName"]> = async (
  parent,
  args,
  ctx
) => {
  // 1. Authorization check
  await ensureAuthorized(ctx, resourceRef, PERMISSION_LEVELS.WRITE);

  // 2. Input validation
  validateInput(args);

  // 3. Business logic execution
  const result = await executeBusinessLogic(args, ctx);

  // 4. Return result
  return result as unknown as ExpectedType;
};
```

#### 3. Field Resolvers

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
    if (!session.user?.id) return null;

    const userRef = resourceRef("users", session.user.id);
    const permission = await getEntityPermission(parent.pk, userRef);

    return permission ? permission.type : null;
  },
};
```

### Error Handling

#### Standard Error Types

```typescript
import { notFound, forbidden, badRequest } from "@hapi/boom";

// Resource not found
if (!resource) {
  throw notFound(i18n._("Resource not found"));
}

// Permission denied
if (!authorized) {
  throw forbidden(i18n._("Insufficient permissions"));
}

// Invalid input
if (!validInput) {
  throw badRequest(i18n._("Invalid input data"));
}
```

#### Internationalized Error Messages

```typescript
// libs/locales/src/i18n.ts
import { i18n } from "@/locales";

throw forbidden(
  i18n.t(
    "User does not have permission of level {minimumPermission} to access this resource ({resource})",
    { minimumPermission, resource }
  )
);
```

## 📈 Performance Optimization

### User Caching System

#### Cache Implementation

```typescript
// libs/graphql/src/resolverContext.ts
export interface UserCache {
  getUser(userRef: ResourceRef<"users">): Promise<EntityRecord | undefined>;
}

export const createUserCache = async (): Promise<UserCache> => {
  const cache = new Map<ResourceRef<"users">, EntityRecord | undefined>();
  const { entity } = await database();

  return {
    getUser: async (userRef) => {
      if (cache.has(userRef)) {
        return cache.get(userRef);
      }
      const user = await entity.get(userRef);
      cache.set(userRef, user);
      return user;
    },
  };
};
```

**Important**: The user cache is created fresh for each GraphQL request and is only valid within that single request. After the request completes, the cache is automatically garbage collected, ensuring no memory leaks between requests.

#### Cache Usage in Resolvers

```typescript
// Before: Direct database call
const { entity } = await database();
const user = await entity.get(userRef);

// After: Using cache
const user = await ctx.userCache.getUser(getResourceRef(userRef));
```

#### Performance Benefits

- **Request-scoped cache**: Each GraphQL request gets its own cache instance that is only valid for the duration of that single request
- **Automatic caching**: User entities cached on first access within the same request
- **Cache hits**: Subsequent accesses within the same request return cached data without database calls
- **Scalable**: Performance improvement scales with duplicate user references within a single request
- **Memory efficient**: Cache is automatically cleared after each request completes

### Efficient Data Fetching

#### Batch Operations

```typescript
// Fetch multiple entities at once
const permissions = await permission.query({
  KeyConditionExpression: "pk = :teamPk",
  ExpressionAttributeValues: { ":teamPk": teamPk },
});

const userRefs = permissions
  .filter((p) => p.sk.startsWith("users/"))
  .map((p) => p.sk);

const users = await entity.batchGet(userRefs);
```

#### Selective Field Resolution

GraphQL's selective field resolution allows clients to request only the data they need:

```graphql
# Only fetch required fields
query GetTeamBasicInfo($teamPk: String!) {
  team(teamPk: $teamPk) {
    pk
    name
    companyPk
    unitPk
  }
}

# Fetch additional fields when needed
query GetTeamWithMembers($teamPk: String!) {
  team(teamPk: $teamPk) {
    pk
    name
    companyPk
    unitPk
    members {
      pk
      name
      email
    }
  }
}
```

**Benefits**:

- **Reduced data transfer**: Only requested fields are fetched and returned
- **Improved performance**: Smaller response payloads and faster network transfers
- **Flexible queries**: Clients can customize data requirements per request
- **Efficient resolvers**: Resolvers only execute for requested fields

## 🔧 Code Generation

TT3 uses GraphQL Code Generator to automatically generate TypeScript types, resolver interfaces, and client-side code from the GraphQL schema. This ensures type safety throughout the application and eliminates manual type definitions.

### GraphQL Code Generator

#### Configuration

```typescript
// codegen.ts
const config: CodegenConfig = {
  schema: "./libs/graphql/src/schema/**/schema.graphql",
  documents: [
    "./apps/frontend/src/graphql/queries/*.graphql",
    "./apps/frontend/src/graphql/mutations/*.graphql",
  ],
  generates: {
    "libs/graphql/src": defineConfig(),
    "apps/frontend/src/graphql/": {
      preset: "client",
      config: { documentMode: "string" },
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: { includeDirectives: true },
    },
  },
};
```

#### Generated Types

The code generator automatically creates TypeScript types that match the GraphQL schema:

```typescript
// Automatically generated types
export type Company = {
  pk: string;
  name: string;
  createdAt: Date;
  createdBy: User;
  updatedAt?: Date;
  updatedBy?: User;
  resourcePermission?: number;
  settings?: (name: string) => any;
  units?: Unit[];
};

export type CompanyResolvers = {
  units?: Resolver<Unit[], Company, any, any>;
  resourcePermission?: Resolver<number | undefined, Company, any, any>;
};
```

These types ensure that:

- **Resolver implementations** match the expected GraphQL schema
- **Frontend queries** are type-safe and validated at compile time
- **API responses** are properly typed for TypeScript compilation
- **Schema changes** automatically update all related types

#### Generated Resolvers

The code generator creates resolver type definitions that enforce proper resolver signatures:

```typescript
// Automatically generated resolver types
export type QueryResolvers = {
  company?: Resolver<Company | undefined, Query, any, CompanyArgs>;
  companies?: Resolver<Company[], Query, any, any>;
  team?: Resolver<Team | undefined, Query, any, TeamArgs>;
  // ... more resolvers
};

export type MutationResolvers = {
  createCompany?: Resolver<Company, Mutation, any, CreateCompanyArgs>;
  updateCompany?: Resolver<Company, Mutation, any, UpdateCompanyArgs>;
  // ... more resolvers
};
```

These resolver types provide:

- **Type safety**: Ensures resolver implementations match the expected signature
- **Auto-completion**: IDE support for resolver parameters and return types
- **Compile-time validation**: Catches type mismatches before runtime
- **Documentation**: Clear understanding of what each resolver should return

## 🌐 API Endpoints

### GraphQL Endpoint

#### Main Endpoint

```
POST /graphql
Content-Type: application/json

{
  "query": "query { companies { name pk } }"
}
```

#### Authentication Endpoints

```
GET  /api/v1/auth/session     # Get current session
POST /api/v1/auth/signin      # Sign in
POST /api/v1/auth/signout     # Sign out
```

### Query Examples

#### Company Queries

```graphql
# Get all companies user has access to
query GetCompanies {
  companies {
    pk
    name
    createdAt
    createdBy {
      name
      email
    }
    units {
      pk
      name
      teams {
        pk
        name
        members {
          name
          email
        }
      }
    }
  }
}

# Get specific company
query GetCompany($companyPk: String!) {
  company(companyPk: $companyPk) {
    pk
    name
    resourcePermission
    settings(name: "theme")
  }
}
```

#### Team Queries

```graphql
# Get team with schedule
query GetTeamSchedule($teamPk: String!, $startDate: Date!, $endDate: Date!) {
  team(teamPk: $teamPk) {
    pk
    name
    schedule(startDate: $startDate, endDate: $endDate) {
      startDate
      endDate
      userSchedules {
        user {
          name
          email
        }
        leaves {
          startDate
          endDate
          type
        }
      }
    }
  }
}
```

#### Shift Position Queries

```graphql
# Get shift positions for a team
query GetShiftPositions($input: QueryShiftPositionsInput!) {
  shiftPositions(input: $input) {
    areAnyUnpublished
    shiftPositions {
      pk
      sk
      day
      name
      color
      requiredSkills
      assignedTo {
        name
        email
      }
      schedules {
        startHourMinutes
        endHourMinutes
        inconveniencePerHour
      }
    }
  }
}
```

### Mutation Examples

#### Company Management

```graphql
# Create company
mutation CreateCompany($name: String!) {
  createCompany(name: $name) {
    pk
    name
    createdAt
    createdBy {
      name
      email
    }
  }
}

# Update company
mutation UpdateCompany($pk: String!, $name: String!) {
  updateCompany(pk: $pk, name: $name) {
    pk
    name
    updatedAt
    updatedBy {
      name
      email
    }
  }
}
```

#### Team Management

```graphql
# Create team
mutation CreateTeam($name: String!, $unitPk: String!) {
  createTeam(name: $name, unitPk: $unitPk) {
    pk
    name
    companyPk
    unitPk
    createdAt
    createdBy {
      name
      email
    }
  }
}

# Add team member
mutation CreateTeamMember($input: CreateTeamMemberInput!) {
  createTeamMember(input: $input) {
    pk
    name
    email
    settings(name: "preferences")
  }
}
```

#### Shift Management

```graphql
# Create shift position
mutation CreateShiftPosition($input: CreateShiftPositionInput!) {
  createShiftPosition(input: $input) {
    pk
    sk
    day
    name
    color
    requiredSkills
    schedules {
      startHourMinutes
      endHourMinutes
      inconveniencePerHour
    }
  }
}

# Assign shift positions
mutation AssignShiftPositions($input: AssignShiftPositionsInput!) {
  assignShiftPositions(input: $input) {
    pk
    sk
    assignedTo {
      name
      email
    }
  }
}
```

## 🔒 Security Features

### Input Validation

#### GraphQL Schema Validation

```graphql
# Required fields are non-nullable
input CreateShiftPositionInput {
  team: String! # Required
  day: String! # Required
  name: String # Optional
  requiredSkills: [String!]! # Required array
  schedules: [ShiftPositionScheduleInput!]! # Required array
}
```

#### Business Logic Validation

```typescript
// Validate business rules
const validateShiftPosition = (input: CreateShiftPositionInput) => {
  if (input.schedules.length === 0) {
    throw badRequest("At least one schedule is required");
  }

  if (input.requiredSkills.length === 0) {
    throw badRequest("At least one required skill is required");
  }

  // Validate schedule times
  for (const schedule of input.schedules) {
    if (schedule.startHourMinutes.length !== schedule.endHourMinutes.length) {
      throw badRequest("Start and end times must have matching lengths");
    }
  }
};
```

### Rate Limiting

#### API Gateway Protection

- **Request throttling**: AWS API Gateway built-in rate limiting
- **Authentication required**: All GraphQL endpoints require valid session
- **Resource quotas**: Per-user and per-endpoint limits

### Input Validation

#### Business Logic Validation

```typescript
// Validate business rules
const validateCompanyName = (name: string): string => {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw badRequest("Company name cannot be empty");
  }
  if (trimmedName.length > 100) {
    throw badRequest("Company name cannot exceed 100 characters");
  }
  return trimmedName;
};

// Use in resolvers
const companyName = validateCompanyName(args.name);
```

**Note**: HTML escaping is handled automatically by React on the frontend, so no additional sanitization is needed in the API layer.

## 📊 Monitoring & Observability

### Sentry Integration

#### Error Tracking

```typescript
// libs/graphql/src/http/any-graphql/index.ts
import { useSentry } from "@envelop/sentry";

const yoga = createYoga({
  plugins: [
    useSentry({
      includeRawResult: false,
      // Sentry configuration
    }),
  ],
});
```

#### Performance Monitoring

- **Query execution time**: Track resolver performance
- **Error rates**: Monitor API error patterns
- **User experience**: Frontend performance metrics

### Logging

#### Structured Logging

```typescript
// Log resolver execution
console.log(`Resolver ${resolverName} executed`, {
  userId: ctx.user?.id,
  resource: resourceRef,
  duration: Date.now() - startTime,
  success: true,
});
```

#### Audit Trail

- **Authentication events**: Login/logout tracking
- **Authorization events**: Permission checks and failures
- **Data modifications**: Create/update/delete operations

## 🚀 Best Practices

### Resolver Design

#### 1. Keep Resolvers Thin

```typescript
// Good: Resolver delegates to business logic
export const createCompany = async (parent, args, ctx) => {
  await ensureAuthorized(ctx, resourceRef, PERMISSION_LEVELS.WRITE);
  return await companyService.create(args, ctx);
};

// Avoid: Complex business logic in resolver
export const createCompany = async (parent, args, ctx) => {
  // Don't put complex business logic here
  // Delegate to service layer instead
};
```

#### 2. Use Type Safety

```typescript
// Always use generated types
export const resolver: NonNullable<QueryResolvers["fieldName"]> = async (
  parent,
  args,
  ctx
) => {
  // Type-safe implementation
  return result as unknown as ExpectedType;
};
```

#### 3. Handle Errors Gracefully

```typescript
// Provide meaningful error messages
try {
  const result = await businessLogic();
  return result;
} catch (error) {
  if (error instanceof ValidationError) {
    throw badRequest(
      i18n._("Invalid input: {message}", { message: error.message })
    );
  }
  if (error instanceof NotFoundError) {
    throw notFound(i18n._("Resource not found"));
  }
  throw error; // Re-throw unexpected errors
}
```

### Performance Optimization

#### 1. Use User Cache

```typescript
// Always use user cache for user entities
const user = await ctx.userCache.getUser(getResourceRef(userRef));
```

#### 2. Batch Database Operations

```typescript
// Fetch multiple entities at once
const entities = await entity.batchGet(entityRefs);
```

#### 3. Selective Field Resolution

```graphql
# Only request needed fields
query GetCompanyBasicInfo($pk: String!) {
  company(companyPk: $pk) {
    pk
    name
    # Don't fetch units if not needed
  }
}
```

## 🔮 Future Enhancements

### Planned Features

1. **GraphQL Subscriptions**: Real-time updates for collaborative features
2. **Rate Limiting**: Advanced rate limiting per user and operation

### Technical Improvements

1. **Performance Monitoring**: Advanced performance analytics
2. **Query Complexity Analysis**: Prevent expensive queries
3. **Automatic Documentation**: Self-updating API documentation
4. **Testing Tools**: Enhanced testing utilities for resolvers

---

**Version**: 1.0.0  
**Maintainer**: Development Team  
**Last Updated**: March 2024
