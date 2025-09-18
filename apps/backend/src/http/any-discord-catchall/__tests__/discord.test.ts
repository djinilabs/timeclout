import { APIGatewayProxyEventV2 } from "aws-lambda";

import { handler } from "../index";

// Mock the business logic
jest.mock("@/business-logic", () => ({
  createDiscordUser: jest.fn(),
}));

describe("Discord API Handler", () => {
  const mockEvent: APIGatewayProxyEventV2 = {
    requestContext: {
      http: {
        method: "POST",
      },
    } as any,
    headers: {
      "x-signature-ed25519": "test-signature",
      "x-signature-timestamp": Math.floor(Date.now() / 1000).toString(),
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
  } as APIGatewayProxyEventV2;

  // Mock environment variable
  const originalEnv = process.env.DISCORD_CS_USERS;

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up authorized user for most tests
    process.env.DISCORD_CS_USERS = JSON.stringify(["123456789"]);
  });

  afterAll(() => {
    // Restore original environment
    process.env.DISCORD_CS_USERS = originalEnv;
  });

  it("should handle PING requests", async () => {
    const pingEvent = {
      ...mockEvent,
      body: JSON.stringify({ type: 1 }),
    };

    // Mock the signature verification to return true
    jest.doMock("../services/discordService", () => ({
      verifyDiscordSignature: jest.fn().mockReturnValue(true),
    }));

    const result = await handler(pingEvent, {} as any);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ type: 1 });
  });

  it("should reject non-POST requests", async () => {
    const getEvent = {
      ...mockEvent,
      requestContext: {
        http: { method: "GET" },
      } as any,
    };

    const result = await handler(getEvent, {} as any);

    expect(result.statusCode).toBe(405);
  });

  it("should handle adduser command successfully", async () => {
    const { createDiscordUser } = require("@/business-logic");
    createDiscordUser.mockResolvedValue({
      success: true,
      userPk: "test-user-id",
    });

    const result = await handler(mockEvent, {} as any);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.data.content).toContain(
      "✅ User **test@example.com** has been successfully added"
    );
    expect(createDiscordUser).toHaveBeenCalledWith({
      email: "test@example.com",
    });
  });

  it("should handle existing user error", async () => {
    const { createDiscordUser } = require("@/business-logic");
    createDiscordUser.mockResolvedValue({
      success: false,
      message: "User already exists",
    });

    const result = await handler(mockEvent, {} as any);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body);
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

    const result = await handler(invalidEmailEvent, {} as any);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.data.content).toContain(
      "❌ Please provide a valid email address"
    );
  });

  it("should reject requests with invalid Discord signature", async () => {
    const invalidSignatureEvent = {
      ...mockEvent,
      headers: {
        "x-signature-ed25519": "invalid-signature",
        "x-signature-timestamp": Math.floor(Date.now() / 1000).toString(),
      },
    };

    const result = await handler(invalidSignatureEvent, {} as any);

    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body)).toEqual({ error: "Unauthorized" });
  });

  it("should reject requests with old timestamp", async () => {
    const oldTimestampEvent = {
      ...mockEvent,
      headers: {
        "x-signature-ed25519": "test-signature",
        "x-signature-timestamp": (
          Math.floor(Date.now() / 1000) - 400
        ).toString(), // 6+ minutes old
      },
    };

    const result = await handler(oldTimestampEvent, {} as any);

    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body)).toEqual({ error: "Unauthorized" });
  });

  it("should reject unauthorized Discord users", async () => {
    // Set up unauthorized user
    process.env.DISCORD_CS_USERS = JSON.stringify(["999999999"]);

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

    const result = await handler(unauthorizedEvent, {} as any);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.data.content).toContain(
      "❌ You are not authorized to use customer service commands"
    );
  });

  it("should handle missing DISCORD_CS_USERS environment variable", async () => {
    delete process.env.DISCORD_CS_USERS;

    const result = await handler(mockEvent, {} as any);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.data.content).toContain(
      "❌ You are not authorized to use customer service commands"
    );
  });

  it("should handle invalid JSON in DISCORD_CS_USERS", async () => {
    process.env.DISCORD_CS_USERS = "invalid-json";

    const result = await handler(mockEvent, {} as any);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.data.content).toContain(
      "❌ You are not authorized to use customer service commands"
    );
  });
});
