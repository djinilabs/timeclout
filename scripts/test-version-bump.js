#!/usr/bin/env node

/**
 * Test script for version bump logic
 * This script simulates the version bump analysis without making actual changes
 */

import fs from 'fs';

// Test cases for version bump detection
const testCases = [
  {
    name: "Feature addition (minor)",
    prTitle: "Add user dashboard",
    prBody: "This PR adds a new user dashboard with analytics",
    commitMessages: ["feat: add user dashboard", "style: improve dashboard layout"],
    expectedBump: "minor"
  },
  {
    name: "Bug fix (patch)",
    prTitle: "Fix login issue",
    prBody: "Fixes the login redirect problem",
    commitMessages: ["fix: resolve login redirect", "test: add login tests"],
    expectedBump: "patch"
  },
  {
    name: "Breaking change (major)",
    prTitle: "Refactor authentication system",
    prBody: "BREAKING CHANGE: Authentication API has changed",
    commitMessages: ["feat!: refactor auth system", "docs: update auth docs"],
    expectedBump: "major"
  },
  {
    name: "Security fix (patch)",
    prTitle: "Security: Fix XSS vulnerability",
    prBody: "Addresses security vulnerability in user input handling",
    commitMessages: ["security: fix xss vulnerability", "test: add security tests"],
    expectedBump: "patch"
  },
  {
    name: "Enhancement (minor)",
    prTitle: "Improve performance",
    prBody: "Enhances the application performance",
    commitMessages: ["perf: optimize database queries", "refactor: improve code structure"],
    expectedBump: "minor"
  },
  {
    name: "Documentation only (patch)",
    prTitle: "Update README",
    prBody: "Updates documentation",
    commitMessages: ["docs: update readme", "chore: update dependencies"],
    expectedBump: "patch"
  },
  {
    name: "New feature with breaking change (major)",
    prTitle: "Add new API endpoints",
    prBody: "Adds new REST API endpoints. BREAKING: Old endpoints deprecated",
    commitMessages: ["feat: add new api endpoints", "feat!: deprecate old endpoints"],
    expectedBump: "major"
  }
];

function analyzeVersionBump(prTitle, prBody, commitMessages) {
  // Combine all text for analysis
  const allText = `${prTitle} ${prBody} ${commitMessages.join(' ')}`.toLowerCase();
  
  console.log(`  Analyzing: "${allText}"`);
  
  // Check for major version indicators (highest priority)
  const majorMatch = allText.match(/(breaking|!|major|feat!|fix!)/);
  if (majorMatch) {
    console.log(`    Major match: "${majorMatch[0]}"`);
    return "major";
  }
  
  // Check for minor version indicators (medium priority)
  // Look for feat: (conventional commits) or specific feature keywords
  const minorMatch = allText.match(/\b(feat[^!]|feature|new|enhancement|improvement|minor|perf)\b/) || 
                     allText.match(/feat:/);
  if (minorMatch) {
    console.log(`    Minor match: "${minorMatch[0]}"`);
    return "minor";
  }
  
  // Check for patch version indicators (lowest priority)
  const patchMatch = allText.match(/\b(fix[^!]|bug|patch|hotfix|security|refactor|style|test|docs|chore)\b/);
  if (patchMatch) {
    console.log(`    Patch match: "${patchMatch[0]}"`);
    return "patch";
  }
  
  // Default to patch
  console.log(`    No matches found, defaulting to patch`);
  return "patch";
}

function calculateNewVersion(currentVersion, bumpType) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (bumpType) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    default:
      return currentVersion;
  }
}

function runTests() {
  console.log("🧪 Testing Version Bump Logic\n");
  
  // Read current version from package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const currentVersion = packageJson.version;
  
  console.log(`Current version: ${currentVersion}\n`);
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`  PR Title: "${testCase.prTitle}"`);
    console.log(`  Commits: ${testCase.commitMessages.join(', ')}`);
    
    const detectedBump = analyzeVersionBump(testCase.prTitle, testCase.prBody, testCase.commitMessages);
    const newVersion = calculateNewVersion(currentVersion, detectedBump);
    
    console.log(`  Expected: ${testCase.expectedBump} -> ${calculateNewVersion(currentVersion, testCase.expectedBump)}`);
    console.log(`  Detected: ${detectedBump} -> ${newVersion}`);
    
    if (detectedBump === testCase.expectedBump) {
      console.log(`  ✅ PASS\n`);
      passed++;
    } else {
      console.log(`  ❌ FAIL\n`);
      failed++;
    }
  });
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log("🎉 All tests passed!");
  } else {
    console.log("⚠️  Some tests failed. Review the logic.");
    process.exit(1);
  }
}

// Run the tests
runTests();
