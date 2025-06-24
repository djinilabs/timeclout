import { Page, Locator, expect } from "@playwright/test";

/**
 * Utility functions for accessibility-focused testing
 * These helpers use ARIA attributes and semantic HTML for robust element selection
 */

export class AccessibilityHelpers {
  constructor(private page: Page) {}

  /**
   * Get an element by its accessible name and role
   */
  getByAccessibleName(
    role:
      | "button"
      | "link"
      | "heading"
      | "textbox"
      | "checkbox"
      | "radio"
      | "combobox"
      | "listbox"
      | "menuitem"
      | "tab"
      | "option"
      | "gridcell"
      | "rowheader"
      | "columnheader"
      | "cell"
      | "row"
      | "listitem"
      | "menubar"
      | "menu"
      | "tablist"
      | "tabpanel"
      | "toolbar"
      | "tooltip"
      | "tree"
      | "treeitem"
      | "treegrid"
      | "grid"
      | "table"
      | "form"
      | "searchbox"
      | "spinbutton"
      | "slider"
      | "progressbar"
      | "meter"
      | "scrollbar"
      | "separator"
      | "switch"
      | "application"
      | "article"
      | "banner"
      | "complementary"
      | "contentinfo"
      | "main"
      | "navigation"
      | "region"
      | "search"
      | "status"
      | "alert"
      | "alertdialog"
      | "dialog"
      | "log"
      | "marquee"
      | "timer"
      | "generic"
      | "presentation"
      | "none"
      | "blockquote"
      | "caption"
      | "code"
      | "definition"
      | "deletion"
      | "directory"
      | "document"
      | "emphasis"
      | "feed"
      | "figure"
      | "group"
      | "img"
      | "insertion"
      | "math"
      | "menuitemcheckbox"
      | "menuitemradio"
      | "note"
      | "paragraph"
      | "radiogroup"
      | "rowgroup"
      | "strong"
      | "subscript"
      | "superscript"
      | "term"
      | "time",
    name: string
  ): Locator {
    return this.page.getByRole(role, { name });
  }

  /**
   * Get an element by its ARIA label
   */
  getByAriaLabel(label: string): Locator {
    return this.page.locator(`[aria-label="${label}"]`);
  }

  /**
   * Get an element by its ARIA described by
   */
  getByAriaDescribedBy(describedBy: string): Locator {
    return this.page.locator(`[aria-describedby="${describedBy}"]`);
  }

  /**
   * Get an element by its ARIA controls
   */
  getByAriaControls(controls: string): Locator {
    return this.page.locator(`[aria-controls="${controls}"]`);
  }

  /**
   * Get an element by its ARIA expanded state
   */
  getByAriaExpanded(expanded: boolean): Locator {
    return this.page.locator(`[aria-expanded="${expanded}"]`);
  }

  /**
   * Get an element by its ARIA pressed state
   */
  getByAriaPressed(pressed: boolean): Locator {
    return this.page.locator(`[aria-pressed="${pressed}"]`);
  }

  /**
   * Get an element by its ARIA current state
   */
  getByAriaCurrent(current: string): Locator {
    return this.page.locator(`[aria-current="${current}"]`);
  }

  /**
   * Get an element by its ARIA live region
   */
  getByAriaLive(politeness: "off" | "polite" | "assertive"): Locator {
    return this.page.locator(`[aria-live="${politeness}"]`);
  }

  /**
   * Get an element by its ARIA hidden state
   */
  getByAriaHidden(hidden: boolean): Locator {
    return this.page.locator(`[aria-hidden="${hidden}"]`);
  }

  /**
   * Get an element by its ARIA required state
   */
  getByAriaRequired(required: boolean): Locator {
    return this.page.locator(`[aria-required="${required}"]`);
  }

  /**
   * Get an element by its ARIA invalid state
   */
  getByAriaInvalid(invalid: boolean | "grammar" | "spelling"): Locator {
    return this.page.locator(`[aria-invalid="${invalid}"]`);
  }

  /**
   * Get an element by its ARIA disabled state
   */
  getByAriaDisabled(disabled: boolean): Locator {
    return this.page.locator(`[aria-disabled="${disabled}"]`);
  }

  /**
   * Get an element by its ARIA busy state
   */
  getByAriaBusy(busy: boolean): Locator {
    return this.page.locator(`[aria-busy="${busy}"]`);
  }

  /**
   * Get an element by its ARIA atomic state
   */
  getByAriaAtomic(atomic: boolean): Locator {
    return this.page.locator(`[aria-atomic="${atomic}"]`);
  }

  /**
   * Get an element by its ARIA relevant attributes
   */
  getByAriaRelevant(relevant: string): Locator {
    return this.page.locator(`[aria-relevant="${relevant}"]`);
  }

  /**
   * Get an element by its ARIA dropeffect
   */
  getByAriaDropEffect(dropEffect: string): Locator {
    return this.page.locator(`[aria-dropeffect="${dropEffect}"]`);
  }

  /**
   * Get an element by its ARIA grabbed state
   */
  getByAriaGrabbed(grabbed: boolean): Locator {
    return this.page.locator(`[aria-grabbed="${grabbed}"]`);
  }

  /**
   * Get an element by its ARIA level (for headings, etc.)
   */
  getByAriaLevel(level: number): Locator {
    return this.page.locator(`[aria-level="${level}"]`);
  }

  /**
   * Get an element by its ARIA posinset
   */
  getByAriaPosInSet(posInSet: number): Locator {
    return this.page.locator(`[aria-posinset="${posInSet}"]`);
  }

  /**
   * Get an element by its ARIA setsize
   */
  getByAriaSetSize(setSize: number): Locator {
    return this.page.locator(`[aria-setsize="${setSize}"]`);
  }

  /**
   * Get an element by its ARIA sort
   */
  getByAriaSort(sort: "none" | "ascending" | "descending" | "other"): Locator {
    return this.page.locator(`[aria-sort="${sort}"]`);
  }

  /**
   * Get an element by its ARIA valuemin
   */
  getByAriaValueMin(valueMin: number): Locator {
    return this.page.locator(`[aria-valuemin="${valueMin}"]`);
  }

  /**
   * Get an element by its ARIA valuemax
   */
  getByAriaValueMax(valueMax: number): Locator {
    return this.page.locator(`[aria-valuemax="${valueMax}"]`);
  }

  /**
   * Get an element by its ARIA valuenow
   */
  getByAriaValueNow(valueNow: number): Locator {
    return this.page.locator(`[aria-valuenow="${valueNow}"]`);
  }

  /**
   * Get an element by its ARIA valuetext
   */
  getByAriaValueText(valueText: string): Locator {
    return this.page.locator(`[aria-valuetext="${valueText}"]`);
  }

  /**
   * Get an element by its ARIA orientation
   */
  getByAriaOrientation(orientation: "horizontal" | "vertical"): Locator {
    return this.page.locator(`[aria-orientation="${orientation}"]`);
  }

  /**
   * Get an element by its ARIA multiselectable state
   */
  getByAriaMultiSelectable(multiSelectable: boolean): Locator {
    return this.page.locator(`[aria-multiselectable="${multiSelectable}"]`);
  }

  /**
   * Get an element by its ARIA readonly state
   */
  getByAriaReadOnly(readOnly: boolean): Locator {
    return this.page.locator(`[aria-readonly="${readOnly}"]`);
  }

  /**
   * Get an element by its ARIA checked state
   */
  getByAriaChecked(checked: boolean | "mixed"): Locator {
    return this.page.locator(`[aria-checked="${checked}"]`);
  }

  /**
   * Get an element by its ARIA selected state
   */
  getByAriaSelected(selected: boolean): Locator {
    return this.page.locator(`[aria-selected="${selected}"]`);
  }

  /**
   * Get an element by its ARIA autocomplete
   */
  getByAriaAutoComplete(
    autoComplete: "inline" | "list" | "both" | "none"
  ): Locator {
    return this.page.locator(`[aria-autocomplete="${autoComplete}"]`);
  }

  /**
   * Get an element by its ARIA haspopup
   */
  getByAriaHasPopup(
    hasPopup: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog"
  ): Locator {
    return this.page.locator(`[aria-haspopup="${hasPopup}"]`);
  }

  /**
   * Get an element by its ARIA modal state
   */
  getByAriaModal(modal: boolean): Locator {
    return this.page.locator(`[aria-modal="${modal}"]`);
  }

  /**
   * Get an element by its ARIA multiline state
   */
  getByAriaMultiLine(multiLine: boolean): Locator {
    return this.page.locator(`[aria-multiline="${multiLine}"]`);
  }

  /**
   * Get an element by its ARIA placeholder
   */
  getByAriaPlaceholder(placeholder: string): Locator {
    return this.page.locator(`[aria-placeholder="${placeholder}"]`);
  }

  /**
   * Get an element by its ARIA rowcount
   */
  getByAriaRowCount(rowCount: number): Locator {
    return this.page.locator(`[aria-rowcount="${rowCount}"]`);
  }

  /**
   * Get an element by its ARIA colcount
   */
  getByAriaColCount(colCount: number): Locator {
    return this.page.locator(`[aria-colcount="${colCount}"]`);
  }

  /**
   * Get an element by its ARIA rowindex
   */
  getByAriaRowIndex(rowIndex: number): Locator {
    return this.page.locator(`[aria-rowindex="${rowIndex}"]`);
  }

  /**
   * Get an element by its ARIA colindex
   */
  getByAriaColIndex(colIndex: number): Locator {
    return this.page.locator(`[aria-colindex="${colIndex}"]`);
  }

  /**
   * Get an element by its ARIA rowspan
   */
  getByAriaRowSpan(rowSpan: number): Locator {
    return this.page.locator(`[aria-rowspan="${rowSpan}"]`);
  }

  /**
   * Get an element by its ARIA colspan
   */
  getByAriaColSpan(colSpan: number): Locator {
    return this.page.locator(`[aria-colspan="${colSpan}"]`);
  }

  /**
   * Get an element by its ARIA activedescendant
   */
  getByAriaActiveDescendant(activeDescendant: string): Locator {
    return this.page.locator(`[aria-activedescendant="${activeDescendant}"]`);
  }

  /**
   * Get an element by its ARIA owns
   */
  getByAriaOwns(owns: string): Locator {
    return this.page.locator(`[aria-owns="${owns}"]`);
  }

  /**
   * Get an element by its ARIA flowto
   */
  getByAriaFlowTo(flowTo: string): Locator {
    return this.page.locator(`[aria-flowto="${flowTo}"]`);
  }

  /**
   * Get an element by its ARIA details
   */
  getByAriaDetails(details: string): Locator {
    return this.page.locator(`[aria-details="${details}"]`);
  }

  /**
   * Get an element by its ARIA errormessage
   */
  getByAriaErrorMessage(errorMessage: string): Locator {
    return this.page.locator(`[aria-errormessage="${errorMessage}"]`);
  }

  /**
   * Get an element by its ARIA labelledby
   */
  getByAriaLabelledBy(labelledBy: string): Locator {
    return this.page.locator(`[aria-labelledby="${labelledBy}"]`);
  }

  /**
   * Get an element by its ARIA keyshortcuts
   */
  getByAriaKeyShortcuts(keyShortcuts: string): Locator {
    return this.page.locator(`[aria-keyshortcuts="${keyShortcuts}"]`);
  }

  /**
   * Get an element by its ARIA roledescription
   */
  getByAriaRoleDescription(roleDescription: string): Locator {
    return this.page.locator(`[aria-roledescription="${roleDescription}"]`);
  }

  /**
   * Get an element by its ARIA virtualcontent
   */
  getByAriaVirtualContent(virtualContent: string): Locator {
    return this.page.locator(`[aria-virtualcontent="${virtualContent}"]`);
  }

  /**
   * Wait for an element to be focused
   */
  async waitForFocus(locator: Locator): Promise<void> {
    await expect(locator).toBeFocused();
  }

  /**
   * Wait for an element to be visible and accessible
   */
  async waitForAccessible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
  }

  /**
   * Check if an element is properly announced to screen readers
   */
  async expectToBeAnnounced(
    locator: Locator,
    expectedText?: string
  ): Promise<void> {
    await expect(locator).toBeVisible();

    if (expectedText) {
      await expect(locator).toHaveText(expectedText);
    }

    // Check for proper ARIA attributes that ensure screen reader announcement
    const ariaLive = await locator.getAttribute("aria-live");
    const role = await locator.getAttribute("role");

    // If it has aria-live, it should be properly announced
    if (ariaLive) {
      expect(["polite", "assertive"]).toContain(ariaLive);
    }

    // If it has a role that's typically announced, it should be accessible
    if (role) {
      expect(["alert", "status", "log", "marquee", "timer"]).toContain(role);
    }
  }

  /**
   * Navigate using keyboard and verify focus management
   */
  async navigateWithKeyboard(
    startElement: Locator,
    key: string,
    expectedFocusElement: Locator
  ): Promise<void> {
    await startElement.focus();
    await this.page.keyboard.press(key);
    await this.waitForFocus(expectedFocusElement);
  }

  /**
   * Test keyboard interaction with an element
   */
  async testKeyboardInteraction(
    locator: Locator,
    key: string,
    expectedAction?: () => Promise<void>
  ): Promise<void> {
    await locator.focus();
    await this.page.keyboard.press(key);

    if (expectedAction) {
      await expectedAction();
    }
  }

  /**
   * Verify proper heading structure
   */
  async verifyHeadingStructure(): Promise<void> {
    const headings = this.page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();

    if (headingCount > 0) {
      // Check that there's at least one h1
      const h1Elements = this.page.locator("h1");
      const h1Count = await h1Elements.count();

      if (h1Count === 0) {
        console.warn(
          "No h1 heading found. Consider adding a main heading for better accessibility."
        );
      }

      // Check for proper heading hierarchy (no skipping levels)
      for (let i = 0; i < headingCount; i++) {
        const heading = headings.nth(i);
        const tagName = await heading.evaluate((el) =>
          el.tagName.toLowerCase()
        );
        const level = parseInt(tagName.charAt(1));

        if (i > 0) {
          const prevHeading = headings.nth(i - 1);
          const prevTagName = await prevHeading.evaluate((el) =>
            el.tagName.toLowerCase()
          );
          const prevLevel = parseInt(prevTagName.charAt(1));

          // Warn if heading levels are skipped (e.g., h1 -> h3)
          if (level - prevLevel > 1) {
            console.warn(`Heading level skipped: ${prevTagName} -> ${tagName}`);
          }
        }
      }
    }
  }

  /**
   * Verify proper form labels and associations
   */
  async verifyFormAccessibility(): Promise<void> {
    const inputs = this.page.locator("input, textarea, select");
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const inputType = await input.getAttribute("type");

      // Skip hidden inputs
      if (inputType === "hidden") continue;

      const id = await input.getAttribute("id");
      const ariaLabel = await input.getAttribute("aria-label");
      const ariaLabelledBy = await input.getAttribute("aria-labelledby");

      // Check if input has proper labeling
      if (!id && !ariaLabel && !ariaLabelledBy) {
        console.warn("Input element lacks proper labeling for accessibility");
      }

      // If it has an id, check for associated label
      if (id) {
        const label = this.page.locator(`label[for="${id}"]`);
        const labelCount = await label.count();

        if (labelCount === 0 && !ariaLabel && !ariaLabelledBy) {
          console.warn(`Input with id "${id}" lacks associated label`);
        }
      }
    }
  }
}

/**
 * Create an instance of AccessibilityHelpers for a page
 */
export function createAccessibilityHelpers(page: Page): AccessibilityHelpers {
  return new AccessibilityHelpers(page);
}
