import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { beforeEach, afterAll, describe, expect, it, vi } from "vitest";

import { handler } from "../index";

// Mock the business logic
vi.mock("@/business-logic", () => ({
  createDiscordUser: vi.fn(),
}));

// Mock the discord service
vi.mock("../services/discordService", async () => {
  const actual = await vi.importActual("../services/discordService");
  return {
    ...actual,
    verifyDiscordSignature: vi.fn().mockReturnValue(true),
    verifyDiscordUser: vi.fn().mockReturnValue(true),
  };
});

describe("Discord API Handler", () => {
  const mockEvent: APIGatewayProxyEventV2 = {
    version: "2.0",
    routeKey: "POST /discord",
    rawPath: "/discord",
    rawQueryString: "",
    headers: {
      "x-signature-ed25519": "test-signature",
      "x-signature-timestamp": Math.floor(Date.now() / 1000).toString(),
    },
    requestContext: {
      accountId: "123456789012",
      apiId: "api-id",
      domainName: "example.com",
      domainPrefix: "test",
      http: {
        method: "POST",
        path: "/discord",
        protocol: "HTTP/1.1",
        sourceIp: "127.0.0.1",
        userAgent: "test-agent",
      },
      requestId: "test-request-id",
      routeKey: "POST /discord",
      stage: "test",
      time: "01/Jan/2024:00:00:00 +0000",
      timeEpoch: 1704067200000,
    },
    body: JSON.stringify({
      type: 2,
      data: {
        name: "adduser",
        options: [
          {
            name: "email",
            value: "test@example.com",
          },
        ],
      },
      member: {
        user: {
          id: "123456789",
        },
      },
    }),
    isBase64Encoded: false,
  };

  // Mock environment variables
  const originalEnv = process.env.DISCORD_CS_USERS;
  const originalPublicKey = process.env.DISCORD_PUBLIC_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    // Set up authorized user for most tests
    process.env.DISCORD_CS_USERS = JSON.stringify(["123456789"]);
    // Set up a mock public key for signature verification
    process.env.DISCORD_PUBLIC_KEY = "mock-public-key";
  });

  afterAll(() => {
    // Restore original environment
    process.env.DISCORD_CS_USERS = originalEnv;
    process.env.DISCORD_PUBLIC_KEY = originalPublicKey;
  });

  it("should handle PING requests", async () => {
    const pingEvent = {
      ...mockEvent,
      body: JSON.stringify({ type: 1 }),
    };

    const result = (await handler(
      pingEvent,
      {} as Context,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result?.statusCode).toBe(200);
    expect(JSON.parse(result?.body || "{}")).toEqual({ type: 1 });
  });

  it("should reject non-POST requests", async () => {
    const getEvent = {
      ...mockEvent,
      requestContext: {
        http: { method: "GET" },
      } as any,
    };

    const result = (await handler(
      getEvent,
      {} as Context,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result?.statusCode).toBe(405);
  });

  it("should handle adduser command successfully", async () => {
    const { createDiscordUser } = await import("@/business-logic");
    vi.mocked(createDiscordUser).mockResolvedValue({
      success: true,
      userPk: "test-user-id",
    });

    const result = (await handler(
      mockEvent,
      {} as Context,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result?.statusCode).toBe(200);
    const responseBody = JSON.parse(result?.body || "{}");
    expect(responseBody.data.content).toContain(
      "✅ User **test@example.com** has been successfully added"
    );
    expect(createDiscordUser).toHaveBeenCalledWith({
      email: "test@example.com",
    });
  });

  it("should handle existing user error", async () => {
    const { createDiscordUser } = await import("@/business-logic");
    vi.mocked(createDiscordUser).mockResolvedValue({
      success: false,
      message: "User already exists",
    });

    const result = (await handler(
      mockEvent,
      {} as Context,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result?.statusCode).toBe(200);
    const responseBody = JSON.parse(result?.body || "{}");
    expect(responseBody.data.content).toContain(
      "❌ User with email **test@example.com** already exists"
    );
  });

  it("should validate email format", async () => {
    const invalidEmailEvent = {
      ...mockEvent,
      body: JSON.stringify({
        type: 2,
        data: {
          name: "adduser",
          options: [
            {
              name: "email",
              value: "invalid-email",
            },
          ],
        },
      }),
    };

    const result = (await handler(
      invalidEmailEvent,
      {} as Context,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result?.statusCode).toBe(200);
    const responseBody = JSON.parse(result?.body || "{}");
    expect(responseBody.data.content).toContain(
      "❌ Please provide a valid email address"
    );
  });

  it("should reject requests with invalid Discord signature", async () => {
    // Mock signature verification to return false
    const { verifyDiscordSignature } = await import(
      "../services/discordService"
    );
    vi.mocked(verifyDiscordSignature).mockReturnValueOnce(false);

    const invalidSignatureEvent = {
      ...mockEvent,
      headers: {
        "x-signature-ed25519": "invalid-signature",
        "x-signature-timestamp": Math.floor(Date.now() / 1000).toString(),
      },
    };

    const result = (await handler(
      invalidSignatureEvent,
      {} as Context,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result?.statusCode).toBe(401);
    expect(JSON.parse(result?.body || "{}")).toEqual({ error: "Unauthorized" });
  });

  it("should reject requests with old timestamp", async () => {
    // Mock signature verification to return false for old timestamp
    const { verifyDiscordSignature } = await import(
      "../services/discordService"
    );
    vi.mocked(verifyDiscordSignature).mockReturnValueOnce(false);

    const oldTimestampEvent = {
      ...mockEvent,
      headers: {
        "x-signature-ed25519": "test-signature",
        "x-signature-timestamp": (
          Math.floor(Date.now() / 1000) - 400
        ).toString(), // 6+ minutes old
      },
    };

    const result = (await handler(
      oldTimestampEvent,
      {} as Context,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result?.statusCode).toBe(401);
    expect(JSON.parse(result?.body || "{}")).toEqual({ error: "Unauthorized" });
  });

  it("should reject unauthorized Discord users", async () => {
    // Mock user verification to return false
    const { verifyDiscordUser } = await import("../services/discordService");
    vi.mocked(verifyDiscordUser).mockReturnValueOnce(false);

    const unauthorizedEvent = {
      ...mockEvent,
      body: JSON.stringify({
        type: 2,
        data: {
          name: "adduser",
          options: [
            {
              name: "email",
              value: "test@example.com",
            },
          ],
        },
        member: {
          user: {
            id: "123456789", // Not in allowed list
          },
        },
      }),
    };

    const result = (await handler(
      unauthorizedEvent,
      {} as Context,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result?.statusCode).toBe(200);
    const responseBody = JSON.parse(result?.body || "{}");
    expect(responseBody.data.content).toContain(
      "❌ You are not authorized to use customer service commands"
    );
  });

  it("should handle missing DISCORD_CS_USERS environment variable", async () => {
    // Mock user verification to return false for missing env var
    const { verifyDiscordUser } = await import("../services/discordService");
    vi.mocked(verifyDiscordUser).mockReturnValueOnce(false);

    delete process.env.DISCORD_CS_USERS;

    const result = (await handler(
      mockEvent,
      {} as Context,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result?.statusCode).toBe(200);
    const responseBody = JSON.parse(result?.body || "{}");
    expect(responseBody.data.content).toContain(
      "❌ You are not authorized to use customer service commands"
    );
  });

  it("should handle invalid JSON in DISCORD_CS_USERS", async () => {
    // Mock user verification to return false for invalid JSON
    const { verifyDiscordUser } = await import("../services/discordService");
    vi.mocked(verifyDiscordUser).mockReturnValueOnce(false);

    process.env.DISCORD_CS_USERS = "invalid-json";

    const result = (await handler(
      mockEvent,
      {} as Context,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result?.statusCode).toBe(200);
    const responseBody = JSON.parse(result?.body || "{}");
    expect(responseBody.data.content).toContain(
      "❌ You are not authorized to use customer service commands"
    );
  });
});
