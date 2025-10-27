# TimeHaupt Technical Documentation

Welcome to the comprehensive technical documentation for TimeHaupt, an AI-powered team scheduling and workforce management platform.

## 📚 Documentation Structure

This documentation is organized into logical sections to help you find the information you need quickly:

### 🚀 [Getting Started](./getting-started/)

- **[Overview](./getting-started/overview.md)** - Project overview, features, and technology stack

### 🛠️ [Development](./development/)

- **[Authentication Debugging](./development/authentication-debugging.md)** - Troubleshooting authentication issues
- **[Google OAuth Setup](./development/google-oauth-setup.md)** - Complete Google OAuth integration guide

### 🏗️ [Architecture](./architecture/)

- **[GraphQL Resolvers](./architecture/graphql-resolvers.md)** - User caching system and resolver optimization
- **[Backend Translations](./architecture/backend-translations.md)** - Internationalization system using Lingui

### 🧪 [Testing](./testing/)

- **[E2E Testing](./testing/e2e-testing.md)** - Playwright-based end-to-end testing guide
- **[User Management Utilities](./testing/user-management-utilities.md)** - Test user creation and management utilities

### 🚀 [Deployment](./deployment/)

- **[GitHub Workflows](./deployment/github-workflows.md)** - CI/CD pipeline configuration and auto-merge setup
- **[Discord Notifications](./deployment/discord-notifications.md)** - Workflow status notifications via Discord

### 🔧 [Operations](./operations/)

- **[Production Table Protection](./operations/production-table-protection.md)** - DynamoDB deletion protection for production tables

## 🎯 Quick Start Guide

### For Developers

1. **Setup**: Read the [Overview](./getting-started/overview.md) to understand the project
2. **Authentication**: Follow [Google OAuth Setup](./development/google-oauth-setup.md) for local development
3. **Testing**: Review [E2E Testing](./testing/e2e-testing.md) for testing workflows

### For DevOps/Operations

1. **Deployment**: Review [GitHub Workflows](./deployment/github-workflows.md) for CI/CD setup
2. **Monitoring**: Check [Discord Notifications](./deployment/discord-notifications.md) for workflow monitoring
3. **Production**: Read [Production Table Protection](./operations/production-table-protection.md) for safety measures

### For Architects

1. **System Design**: Review [GraphQL Resolvers](./architecture/graphql-resolvers.md) for performance optimization
2. **Internationalization**: Check [Backend Translations](./architecture/backend-translations.md) for multi-language support

## 🔍 Finding Information

### By Topic

- **Authentication**: [Debugging](./development/authentication-debugging.md) | [OAuth Setup](./development/google-oauth-setup.md)
- **Testing**: [E2E Testing](./testing/e2e-testing.md) | [User Management](./testing/user-management-utilities.md)
- **Deployment**: [Workflows](./deployment/github-workflows.md) | [Notifications](./deployment/discord-notifications.md)
- **Operations**: [Table Protection](./operations/production-table-protection.md)

### By Role

- **Frontend Developer**: [Overview](./getting-started/overview.md), [E2E Testing](./testing/e2e-testing.md)
- **Backend Developer**: [GraphQL Resolvers](./architecture/graphql-resolvers.md), [Translations](./architecture/backend-translations.md)
- **DevOps Engineer**: [GitHub Workflows](./deployment/github-workflows.md), [Table Protection](./operations/production-table-protection.md)
- **QA Engineer**: [E2E Testing](./testing/e2e-testing.md), [User Management](./testing/user-management-utilities.md)

## 📝 Contributing to Documentation

When adding new technical documentation:

1. **Choose the right category** from the folder structure above
2. **Follow the existing format** and style
3. **Update this README** to include new documents
4. **Use clear, descriptive filenames** that indicate the content
5. **Include practical examples** and code snippets where relevant

## 🔗 Related Resources

- **Repository**: [GitHub Repository](https://github.com/djinilabs/tt3)
- **Live Application**: [TimeHaupt](https://timehaupt.com)
- **Issue Tracker**: [GitHub Issues](https://github.com/djinilabs/tt3/issues)
- **Discussions**: [GitHub Discussions](https://github.com/djinilabs/tt3/discussions)

## 📞 Support

- **Technical Issues**: Create a GitHub issue
- **Documentation**: Submit a pull request with improvements
- **General Questions**: Use GitHub Discussions
- **Emergency**: Contact the development team directly

---

**Last Updated**: $(date)
**Version**: 1.0.0
