# TimeHaupt Technical Documentation - Table of Contents

## 📋 Quick Reference

This document provides a high-level overview of all available technical documentation, organized by category and purpose.

---

## 🚀 **Getting Started**

| Document                                  | Purpose                           | Audience  | Key Topics                            |
| ----------------------------------------- | --------------------------------- | --------- | ------------------------------------- |
| [Overview](./getting-started/overview.md) | Project introduction and features | All users | Features, tech stack, getting started |

---

## 🛠️ **Development**

| Document                                                              | Purpose                    | Audience           | Key Topics                                 |
| --------------------------------------------------------------------- | -------------------------- | ------------------ | ------------------------------------------ |
| [Authentication Debugging](./development/authentication-debugging.md) | Troubleshoot auth issues   | Developers, DevOps | NextAuth.js, OAuth, email auth             |
| [Google OAuth Setup](./development/google-oauth-setup.md)             | Complete OAuth integration | Developers         | Google Cloud, OAuth 2.0, environment setup |

---

## 🏗️ **Architecture**

| Document                                                       | Purpose                  | Audience           | Key Topics                           |
| -------------------------------------------------------------- | ------------------------ | ------------------ | ------------------------------------ |
| [GraphQL Resolvers](./architecture/graphql-resolvers.md)       | Performance optimization | Backend developers | User caching, resolver optimization  |
| [Backend Translations](./architecture/backend-translations.md) | Internationalization     | Backend developers | Lingui, i18n, multi-language support |

---

## 🧪 **Testing**

| Document                                                            | Purpose                  | Audience       | Key Topics                                 |
| ------------------------------------------------------------------- | ------------------------ | -------------- | ------------------------------------------ |
| [E2E Testing](./testing/e2e-testing.md)                             | End-to-end testing guide | QA, Developers | Playwright, test structure, best practices |
| [User Management Utilities](./testing/user-management-utilities.md) | Test user management     | QA, Developers | Test fixtures, user creation, cleanup      |

---

## 🚀 **Deployment**

| Document                                                       | Purpose              | Audience           | Key Topics                             |
| -------------------------------------------------------------- | -------------------- | ------------------ | -------------------------------------- |
| [GitHub Workflows](./deployment/github-workflows.md)           | CI/CD pipeline setup | DevOps, Developers | GitHub Actions, auto-merge, deployment |
| [Discord Notifications](./deployment/discord-notifications.md) | Workflow monitoring  | DevOps, Team leads | Discord webhooks, status notifications |

---

## 🔧 **Operations**

| Document                                                                   | Purpose         | Audience     | Key Topics                             |
| -------------------------------------------------------------------------- | --------------- | ------------ | -------------------------------------- |
| [Production Table Protection](./operations/production-table-protection.md) | Database safety | DevOps, DBAs | DynamoDB, deletion protection, AWS CLI |

---

## 🎯 **By Role - What to Read**

### **Frontend Developer**

- [Overview](./getting-started/overview.md) - Understand the project
- [E2E Testing](./testing/e2e-testing.md) - Learn testing practices
- [User Management Utilities](./testing/user-management-utilities.md) - Test user workflows

### **Backend Developer**

- [Overview](./getting-started/overview.md) - Project context
- [GraphQL Resolvers](./architecture/graphql-resolvers.md) - Performance optimization
- [Backend Translations](./architecture/backend-translations.md) - i18n implementation
- [Authentication Debugging](./development/authentication-debugging.md) - Auth troubleshooting

### **DevOps Engineer**

- [GitHub Workflows](./deployment/github-workflows.md) - CI/CD setup
- [Discord Notifications](./deployment/discord-notifications.md) - Monitoring setup
- [Production Table Protection](./operations/production-table-protection.md) - Database safety
- [Google OAuth Setup](./development/google-oauth-setup.md) - Environment configuration

### **QA Engineer**

- [E2E Testing](./testing/e2e-testing.md) - Testing framework
- [User Management Utilities](./testing/user-management-utilities.md) - Test utilities
- [Overview](./getting-started/overview.md) - Feature understanding

### **Team Lead / Manager**

- [Overview](./getting-started/overview.md) - Project overview
- [GitHub Workflows](./deployment/github-workflows.md) - Development process
- [Discord Notifications](./deployment/discord-notifications.md) - Team monitoring

---

## 🔍 **By Topic - Quick Find**

### **Authentication & Security**

- [Authentication Debugging](./development/authentication-debugging.md)
- [Google OAuth Setup](./development/google-oauth-setup.md)

### **Testing & Quality**

- [E2E Testing](./testing/e2e-testing.md)
- [User Management Utilities](./testing/user-management-utilities.md)

### **Deployment & Operations**

- [GitHub Workflows](./deployment/github-workflows.md)
- [Discord Notifications](./deployment/discord-notifications.md)
- [Production Table Protection](./operations/production-table-protection.md)

### **Performance & Architecture**

- [GraphQL Resolvers](./architecture/graphql-resolvers.md)
- [Backend Translations](./architecture/backend-translations.md)

---

## 📚 **Documentation Standards**

### **File Naming**

- Use kebab-case for filenames
- Include descriptive names that indicate content
- Group related documents in appropriate folders

### **Content Structure**

- Clear headings and subheadings
- Code examples where relevant
- Practical usage instructions
- Troubleshooting sections when applicable

### **Maintenance**

- Update this TOC when adding new documents
- Keep links current and working
- Review and update content regularly

---

## 🚨 **Critical Documents**

These documents contain critical information for production operations:

1. **[Production Table Protection](./operations/production-table-protection.md)** - Prevents data loss
2. **[GitHub Workflows](./deployment/github-workflows.md)** - Deployment process
3. **[Authentication Debugging](./development/authentication-debugging.md)** - User access issues

---

## 📞 **Getting Help**

- **Documentation Issues**: Update this TOC or submit PR
- **Technical Questions**: Check relevant documentation first
- **Missing Information**: Create issue or contribute documentation
- **Emergency**: Contact development team directly

---

**Last Updated**: $(date)
**Total Documents**: 10
**Categories**: 6
