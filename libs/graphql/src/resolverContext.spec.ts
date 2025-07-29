import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUserCache, UserCache } from "./resolverContext";
import { database } from "@/tables";
import { resourceRef } from "@/utils";

// Mock the database module
vi.mock("@/tables", () => ({
  database: vi.fn(),
}));

describe("UserCache", () => {
  let mockEntity: { get: ReturnType<typeof vi.fn> };
  let userCache: UserCache;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create mock entity
    mockEntity = {
      get: vi.fn(),
    };

    // Mock database function
    (database as ReturnType<typeof vi.fn>).mockResolvedValue({
      entity: mockEntity,
    });
  });

  it("should cache user entities and avoid repeated database calls", async () => {
    const userRef = resourceRef("users", "user123");
    const mockUser = {
      pk: userRef,
      name: "Test User",
      email: "test@example.com",
    };

    // Mock the database to return the user
    mockEntity.get.mockResolvedValue(mockUser);

    // Create cache
    userCache = await createUserCache();

    // First call should hit the database
    const user1 = await userCache.getUser(userRef);
    expect(user1).toEqual(mockUser);
    expect(mockEntity.get).toHaveBeenCalledTimes(1);
    expect(mockEntity.get).toHaveBeenCalledWith(userRef);

    // Second call should use cache
    const user2 = await userCache.getUser(userRef);
    expect(user2).toEqual(mockUser);
    expect(mockEntity.get).toHaveBeenCalledTimes(1); // Still only 1 call

    // Third call should also use cache
    const user3 = await userCache.getUser(userRef);
    expect(user3).toEqual(mockUser);
    expect(mockEntity.get).toHaveBeenCalledTimes(1); // Still only 1 call
  });

  it("should handle different user references separately", async () => {
    const userRef1 = resourceRef("users", "user123");
    const userRef2 = resourceRef("users", "user456");
    const mockUser1 = {
      pk: userRef1,
      name: "User 1",
      email: "user1@example.com",
    };
    const mockUser2 = {
      pk: userRef2,
      name: "User 2",
      email: "user2@example.com",
    };

    // Mock the database to return different users
    mockEntity.get
      .mockResolvedValueOnce(mockUser1)
      .mockResolvedValueOnce(mockUser2);

    // Create cache
    userCache = await createUserCache();

    // First user
    const user1 = await userCache.getUser(userRef1);
    expect(user1).toEqual(mockUser1);
    expect(mockEntity.get).toHaveBeenCalledTimes(1);

    // Second user
    const user2 = await userCache.getUser(userRef2);
    expect(user2).toEqual(mockUser2);
    expect(mockEntity.get).toHaveBeenCalledTimes(2);

    // Cache hits for both users
    const cachedUser1 = await userCache.getUser(userRef1);
    const cachedUser2 = await userCache.getUser(userRef2);
    expect(cachedUser1).toEqual(mockUser1);
    expect(cachedUser2).toEqual(mockUser2);
    expect(mockEntity.get).toHaveBeenCalledTimes(2); // No additional calls
  });

  it("should handle non-existent users", async () => {
    const userRef = resourceRef("users", "nonexistent");

    // Mock the database to return undefined
    mockEntity.get.mockResolvedValue(undefined);

    // Create cache
    userCache = await createUserCache();

    // First call should hit the database
    const user1 = await userCache.getUser(userRef);
    expect(user1).toBeUndefined();
    expect(mockEntity.get).toHaveBeenCalledTimes(1);

    // Second call should use cache (undefined is also cached)
    const user2 = await userCache.getUser(userRef);
    expect(user2).toBeUndefined();
    expect(mockEntity.get).toHaveBeenCalledTimes(1); // Still only 1 call
  });

  it("should handle database errors", async () => {
    const userRef = resourceRef("users", "user123");
    const error = new Error("Database error");

    // Mock the database to throw an error
    mockEntity.get.mockRejectedValue(error);

    // Create cache
    userCache = await createUserCache();

    // Call should throw the error
    await expect(userCache.getUser(userRef)).rejects.toThrow("Database error");
    expect(mockEntity.get).toHaveBeenCalledTimes(1);
  });
});
