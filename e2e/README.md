# End-to-End Tests with Playwright

This directory contains end-to-end tests for the TT3 application using Playwright. The tests are designed with accessibility in mind, using ARIA attributes and semantic HTML for robust element selection.

## Setup

1. Install Playwright browsers:

   ```bash
   pnpm test:e2e:install
   ```

2. Make sure the development server is running:
   ```bash
   pnpm dev
   ```

## Running Tests

### Basic Test Execution

```bash
# Run all e2e tests
pnpm test:e2e

# Run tests with UI mode (interactive)
pnpm test:e2e:ui

# Run tests in headed mode (see browser)
pnpm test:e2e:headed

# Run tests in debug mode
pnpm test:e2e:debug
```

### Running Specific Tests

```bash
# Run only login tests
pnpm test:e2e --grep "Login"

# Run tests in a specific browser
pnpm test:e2e --project=chromium

# Run tests in mobile viewport
pnpm test:e2e --project="Mobile Chrome"
```

## Test Structure

### Accessibility-Focused Testing

The tests use accessibility attributes for element selection to make them more robust and maintainable:

- **Role-based selectors**: `page.getByRole('button', { name: 'Sign in' })`
- **ARIA attributes**: `page.locator('[aria-label="Sign in to your account"]')`
- **Semantic HTML**: `page.getByRole('heading', { level: 2 })`

### Test Files

- `login.spec.ts` - Basic login functionality tests
- `login-with-helpers.spec.ts` - Login tests using accessibility helpers
- `utils/accessibility-helpers.ts` - Utility functions for accessibility-focused testing

### Accessibility Helpers

The `AccessibilityHelpers` class provides methods for:

- **Element selection by ARIA attributes**: `getByAriaLabel()`, `getByAriaExpanded()`, etc.
- **Accessibility verification**: `verifyHeadingStructure()`, `verifyFormAccessibility()`
- **Keyboard navigation testing**: `navigateWithKeyboard()`, `testKeyboardInteraction()`
- **Focus management**: `waitForFocus()`, `waitForAccessible()`

## Test Coverage

### Login Flow Tests

1. **Page Display**: Verifies login page loads with proper accessibility attributes
2. **Keyboard Navigation**: Tests focus management and keyboard interaction
3. **Button Interaction**: Tests sign-in button click and redirect behavior
4. **Loading States**: Verifies accessibility during loading/disabled states
5. **Error Handling**: Tests error message accessibility
6. **Mobile Responsiveness**: Tests touch interaction and mobile viewport
7. **Form Accessibility**: Verifies proper form labeling and ARIA attributes

### Accessibility Standards

Tests verify compliance with:

- **WCAG 2.1 AA**: Basic accessibility requirements
- **Semantic HTML**: Proper use of headings, buttons, forms
- **ARIA attributes**: Correct implementation of accessibility attributes
- **Keyboard navigation**: Full keyboard accessibility
- **Screen reader support**: Proper announcement of dynamic content

## Configuration

The Playwright configuration (`playwright.config.ts`) includes:

- **Multiple browsers**: Chrome, Firefox, Safari, and mobile browsers
- **Accessibility features**: Screenshots and videos on failure
- **Development server**: Automatic startup of the frontend dev server
- **Parallel execution**: Tests run in parallel for faster execution

## Best Practices

### Writing Accessible Tests

1. **Use semantic selectors**: Prefer `getByRole()` over CSS selectors
2. **Test keyboard navigation**: Verify all interactions work with keyboard
3. **Check ARIA attributes**: Verify proper accessibility attributes
4. **Test screen reader announcements**: Use `aria-live` regions appropriately
5. **Verify focus management**: Ensure proper focus order and visibility

### Test Maintenance

1. **Use accessibility helpers**: Leverage the `AccessibilityHelpers` class
2. **Avoid brittle selectors**: Don't rely on CSS classes or text content
3. **Test across browsers**: Run tests on multiple browsers
4. **Include mobile testing**: Test responsive behavior
5. **Document test purpose**: Add clear comments explaining test intent

## Troubleshooting

### Common Issues

1. **Tests failing on CI**: Ensure proper browser installation
2. **Timing issues**: Use `waitForLoadState()` and proper assertions
3. **Element not found**: Check if accessibility attributes have changed
4. **Mobile test failures**: Verify viewport settings and touch interactions

### Debug Tips

1. **Use UI mode**: `pnpm test:e2e:ui` for interactive debugging
2. **Enable headed mode**: `pnpm test:e2e:headed` to see browser actions
3. **Use debug mode**: `pnpm test:e2e:debug` for step-by-step execution
4. **Check screenshots**: Failed tests generate screenshots in `test-results/`

## Contributing

When adding new tests:

1. Follow the accessibility-first approach
2. Use the `AccessibilityHelpers` class when possible
3. Test both desktop and mobile scenarios
4. Include keyboard navigation tests
5. Verify proper ARIA attributes
6. Add clear test descriptions and comments
