import { describe, it, expect } from "vitest";
import { generateAccessibilityObjectModel } from "./generateAOM";

function createTestDocument(html: string): Document {
  return new window.DOMParser().parseFromString(html, "text/html");
}

describe("generateAccessibilityObjectModel", () => {
  it("should return an empty root if no elements have roles", () => {
    const doc = createTestDocument("<div><span>No roles here</span></div>");
    const aom = generateAccessibilityObjectModel(doc);
    expect(aom.root.role).toBe("root");
    expect(aom.root.children).toBeNull();
  });

  it("should include only elements with explicit roles", () => {
    const doc = createTestDocument(`
      <div>
        <button role="button" aria-label="Click me">Click me</button>
        <span>No role</span>
        <section role="region" aria-label="Section">Section</section>
      </div>
    `);
    const aom = generateAccessibilityObjectModel(doc);
    expect(aom.root.children).toHaveLength(2);
    expect(aom.root.children?.[0].role).toBe("button");
    expect(aom.root.children?.[0].description).toBe("Click me");
    expect(aom.root.children?.[1].role).toBe("region");
    expect(aom.root.children?.[1].description).toBe("Section");
  });

  it("should bypass nodes without roles and attach their children to the parent", () => {
    const doc = createTestDocument(`
      <div>
        <div>
          <button role="button" aria-label="Btn1">Btn1</button>
          <span>No role</span>
          <button role="button" aria-label="Btn2">Btn2</button>
        </div>
      </div>
    `);
    const aom = generateAccessibilityObjectModel(doc);
    expect(aom.root.children).toHaveLength(2);
    expect(aom.root.children?.[0].description).toBe("Btn1");
    expect(aom.root.children?.[1].description).toBe("Btn2");
  });

  it("should handle nested roles and bypass intermediate nodes without roles", () => {
    const doc = createTestDocument(`
      <div>
        <div>
          <section role="region" aria-label="Outer">
            <div>
              <button role="button" aria-label="InnerBtn">Inner</button>
            </div>
          </section>
        </div>
      </div>
    `);
    const aom = generateAccessibilityObjectModel(doc);
    expect(aom.root.children).toHaveLength(1);
    expect(aom.root.role).toBe("region");
    const region = aom.root;
    expect(region?.children).toHaveLength(1);
    expect(region?.children?.[0].role).toBe("button");
    expect(region?.children?.[0].description).toBe("InnerBtn");
  });

  it("should use aria-label, aria-description, or text content for description", () => {
    const doc = createTestDocument(`
      <div>
        <button role="button" aria-label="Labelled">Text</button>
        <button role="button" aria-description="Described">Text</button>
        <button role="button">TextContent</button>
      </div>
    `);
    const aom = generateAccessibilityObjectModel(doc);
    expect(aom.root.children?.[0].description).toBe("Labelled");
    expect(aom.root.children?.[1].description).toBe("Described");
    expect(aom.root.children?.[2].description).toBe("TextContent");
  });

  it("should include all aria-* attributes as properties without the aria- prefix", () => {
    const doc = createTestDocument(`
      <div role="generic">
        <button 
          role="button" 
          aria-expanded="true"
          aria-controls="menu"
          aria-haspopup="true"
          aria-pressed="false"
          aria-disabled="true"
        >
          Menu Button
        </button>
      </div>
    `);
    const aom = generateAccessibilityObjectModel(doc);
    const button = aom.root.children?.[0];

    console.log("Test - Button element:", button);

    expect(button?.attributes["aria-expanded"]).toBe("true");
    expect(button?.attributes["aria-controls"]).toBe("menu");
    expect(button?.attributes["aria-haspopup"]).toBe("true");
    expect(button?.attributes["aria-pressed"]).toBe("false");
    expect(button?.attributes["aria-disabled"]).toBe("true");

    expect(button?.role).toBe("button");
    expect(button?.description).toBe("Menu Button");
  });
});
