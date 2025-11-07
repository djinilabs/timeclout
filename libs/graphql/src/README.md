# GraphQL Resolvers with User Caching

This module contains GraphQL resolvers with an optimized user caching system to improve query performance.

## User Cache Implementation

The user cache is implemented to avoid repeated database calls when multiple entities reference the same user in a single GraphQL request. This is particularly important for queries that return multiple shift positions, companies, teams, or other entities that have `createdBy`, `updatedBy`, or `assignedTo` fields.

### How it works

1. **Request-scoped cache**: Each GraphQL request gets its own user cache instance
2. **Automatic caching**: User entities are cached on first access and reused for subsequent accesses
3. **Cache hits**: When the same user is requested multiple times, the cache returns the stored entity without hitting the database
4. **Cache misses**: When a user is requested for the first time, it's fetched from the database and stored in the cache
5. **Proper resource reference handling**: Uses `getResourceRef` function to properly convert string references to `ResourceRef` objects

### Performance Benefits

- **Reduced database calls**: Multiple entities with the same user references only trigger one database call
- **Faster response times**: Eliminates redundant database queries within a single request
- **Scalable**: Performance improvement scales with the number of duplicate user references

### Usage

The cache is automatically available in all resolver contexts. Resolvers that need to fetch user entities should use the cache instead of direct database calls:

```typescript
// Before (direct database call)
const { entity } = await database();
const user = await entity.get(userRef);

// After (using cache with getResourceRef)
const user = await ctx.userCache.getUser(getResourceRef(userRef));
```

### Updated Resolvers

The following resolvers have been updated to use the user cache with proper `getResourceRef` handling:

- `ShiftPosition.assignedTo`
- `Company.createdBy` and `Company.updatedBy`
- `Team.createdBy` and `Team.updatedBy`
- `Unit.createdBy` and `Unit.updatedBy`
- `User.createdBy` and `User.updatedBy`
- `Invitation.createdBy` and `Invitation.updatedBy`
- `LeaveRequest.createdBy`, `LeaveRequest.updatedBy`, and `LeaveRequest.beneficiary`

### Implementation Details

- **Type Safety**: All resolvers use proper type casting to access raw database fields where user references are stored as strings
- **Resource References**: Uses `getResourceRef` function to convert string references to proper `ResourceRef` objects
- **Cache Consistency**: Caches both existing and non-existing users to avoid repeated database calls for missing users
- **Request Isolation**: Each GraphQL request gets its own cache instance, ensuring data consistency within the request scope
