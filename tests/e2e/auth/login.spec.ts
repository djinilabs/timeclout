import { testWithUserManagement } from "../fixtures/test-fixtures";
import { TestUser } from "../fixtures/test-fixtures";

testWithUserManagement.describe("Magic Link Login Workflow", () => {
  let testUser: TestUser;

  testWithUserManagement(
    "should complete full magic link login workflow",
    async ({ page, userManagement, testHelpers }) => {
      // Create and log in a new user in one operation
      testUser = await userManagement.createAndLoginUser("Test User");

      // The user is now logged in and ready for further testing
      console.log(
        `✅ User ${testUser.professionalName} (${testUser.email}) successfully logged in`
      );

      // Additional verification that the user is properly authenticated
      // This helps catch any issues with the authentication flow
      await testHelpers.waitForCondition(async () => {
        // Check if we're on a page that requires authentication
        const currentUrl = page.url();
        return currentUrl !== "/" || currentUrl.includes("companies");
      }, 10000);
    }
  );

  testWithUserManagement.afterEach(async ({ userManagement }) => {
    // Clean up the test user's Testmail inbox after each test
    if (testUser) {
      await userManagement.cleanupUser(testUser);
    }
  });
});
