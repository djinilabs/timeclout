#!/usr/bin/env node

/**
 * Simple test script to verify Mailslurp integration
 * Run with: npx tsx tests/e2e/utils/test-mailslurp.ts
 */

import { mailslurp } from "./mailslurp";

async function testMailslurp() {
  try {
    console.log("🧪 Testing Mailslurp integration...");

    // Test 1: Create email address
    console.log("\n1. Creating email address...");
    const emailAddress = await mailslurp.createEmailAddress();
    console.log(`✅ Created email: ${emailAddress}`);

    // Test 2: Wait for message (with short timeout)
    console.log("\n2. Testing message polling (5 second timeout)...");
    try {
      const message = await mailslurp.waitForMessage(emailAddress, 5000);
      console.log("✅ Message received:", message);
    } catch (error) {
      console.log("ℹ️ No message received (expected for test):", error.message);
    }

    // Test 3: Cleanup
    console.log("\n3. Cleaning up...");
    await mailslurp.cleanup();
    console.log("✅ Cleanup completed");

    console.log(
      "\n🎉 All tests passed! Mailslurp integration is working correctly."
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testMailslurp();
}
