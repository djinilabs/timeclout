import { testWithUserManagement , TestUser } from "../fixtures/test-fixtures";

testWithUserManagement.describe("User Management Examples", () => {
  let testUser: TestUser;
  let managerUser: TestUser;

  testWithUserManagement(
    "should create and login multiple users for testing",
    async ({ userManagement }) => {
      // Example 1: Create a regular test user
      testUser = await userManagement.createAndLoginUser("Regular User");
      console.log(`✅ Created and logged in: ${testUser.professionalName}`);

      // Example 2: Create a manager user with custom options
      managerUser = await userManagement.createAndLoginUser("Manager User", {
        waitForEmailTimeout: 180_000, // 3 minutes timeout
      });
      console.log(`✅ Created and logged in: ${managerUser.professionalName}`);

      // Now both users are logged in and ready for testing
      // You can use them to test different user roles, permissions, etc.

      // Example: Verify both users are authenticated
      await userManagement.verifyUserAuthenticated(testUser);
      await userManagement.verifyUserAuthenticated(managerUser);
    }
  );

  testWithUserManagement(
    "should handle step-by-step user creation when needed",
    async ({ userManagement }) => {
      // Example 3: Step-by-step user creation for more control
      const customUser = await userManagement.createTestUser("Custom User");
      console.log(`✅ Created test user: ${customUser.email}`);

      // You can add custom logic between steps if needed
      // For example, you might want to set up some test data first

      // Then complete the login workflow
      await userManagement.completeMagicLinkLoginWorkflow(customUser);
      console.log(
        `✅ Completed login workflow for: ${customUser.professionalName}`
      );

      // Store the user for cleanup
      testUser = customUser;
    }
  );

  testWithUserManagement(
    "should handle user creation with different professional names",
    async ({ userManagement }) => {
      // Example 4: Create users with different names for role-based testing
      const adminUser = await userManagement.createAndLoginUser("Admin User");
      const employeeUser = await userManagement.createAndLoginUser(
        "Employee User"
      );
      const contractorUser = await userManagement.createAndLoginUser(
        "Contractor User"
      );

      console.log(`✅ Created admin: ${adminUser.professionalName}`);
      console.log(`✅ Created employee: ${employeeUser.professionalName}`);
      console.log(`✅ Created contractor: ${contractorUser.professionalName}`);

      // Store users for cleanup
      testUser = adminUser;
      managerUser = employeeUser;
    }
  );

  testWithUserManagement.afterEach(async ({ userManagement }) => {
    // Clean up all test users
    if (testUser) {
      await userManagement.cleanupUser(testUser);
    }
    if (managerUser) {
      await userManagement.cleanupUser(managerUser);
    }
  });
});
