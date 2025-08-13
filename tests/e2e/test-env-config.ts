#!/usr/bin/env tsx

import { e2eConfig, validateEnvironment } from "./config/env";

console.log("Testing E2E Environment Configuration...\n");

// Display current configuration
console.log("Current Configuration:");
console.log("=====================");
console.log(
  `Mailslurp API Key: ${
    e2eConfig.mailslurp.apiKey ? "✅ Present" : "❌ Missing"
  }`
);
console.log(`Base URL: ${e2eConfig.app.baseUrl}`);
console.log(`Test Timeout: ${e2eConfig.test.timeout}ms`);
console.log(`Action Timeout: ${e2eConfig.test.actionTimeout}ms`);
console.log(`CI Mode: ${e2eConfig.test.ci}`);
console.log(`Headless: ${e2eConfig.test.headless}`);
console.log(`Browser: ${e2eConfig.browser.name}`);
console.log(`Screenshot: ${e2eConfig.recording.screenshot}`);
console.log(`Video: ${e2eConfig.recording.video}`);
console.log(`Trace: ${e2eConfig.recording.trace}`);

console.log("\nValidating Environment...");
try {
  validateEnvironment();
  console.log("✅ Environment validation passed!");
} catch (error) {
  console.error("❌ Environment validation failed:", error.message);
  process.exit(1);
}

console.log("\nEnvironment configuration is ready for e2e tests!");
