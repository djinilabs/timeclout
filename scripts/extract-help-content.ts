import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import * as t from "@babel/types";

const traverse = _traverse.default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface HelpChunk {
  id: string;
  text: string;
  metadata: {
    section: string;
    language: string;
    feature?: string;
    type: string;
  };
}

interface ExtractedContent {
  chunks: HelpChunk[];
}

/**
 * Extract text from JSX/React nodes recursively
 */
function extractTextFromNode(node: t.Node): string {
  if (t.isStringLiteral(node)) {
    return node.value;
  }
  if (t.isTemplateLiteral(node)) {
    return node.quasis.map((q) => q.value.cooked || "").join("");
  }
  if (t.isJSXElement(node) || t.isJSXFragment(node)) {
    return node.children
      .map((child) => {
        if (t.isJSXText(child)) {
          return child.value.trim();
        }
        if (t.isJSXElement(child) || t.isJSXExpressionContainer(child)) {
          if (t.isJSXExpressionContainer(child)) {
            if (t.isStringLiteral(child.expression)) {
              return child.expression.value;
            }
            if (t.isTemplateLiteral(child.expression)) {
              return child.expression.quasis
                .map((q) => q.value.cooked || "")
                .join("");
            }
            // For other expressions, try to extract text recursively
            return extractTextFromNode(child.expression);
          }
          return extractTextFromNode(child);
        }
        return "";
      })
      .filter((text) => text.length > 0)
      .join(" ");
  }
  if (t.isArrayExpression(node)) {
    return node.elements
      .filter((el): el is t.Expression => el !== null)
      .map((el) => extractTextFromNode(el))
      .filter((text) => text.length > 0)
      .join(" ");
  }
  if (t.isObjectExpression(node)) {
    return node.properties
      .map((prop) => {
        if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
          const key = prop.key.name;
          const value = extractTextFromNode(prop.value);
          return value ? `${key}: ${value}` : "";
        }
        return "";
      })
      .filter((text) => text.length > 0)
      .join(" ");
  }
  return "";
}

/**
 * Extract text from a JSX expression
 */
function extractTextFromJSX(expression: t.Node): string {
  const text = extractTextFromNode(expression);
  // Clean up extra whitespace
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Process a help content file and extract chunks
 */
async function processHelpFile(
  filePath: string,
  language: string,
  section: string
): Promise<HelpChunk[]> {
  const content = await readFile(filePath, "utf-8");
  const chunks: HelpChunk[] = [];

  try {
    const ast = parser.parse(content, {
      sourceType: "module",
      plugins: [
        "typescript",
        "jsx",
        "decorators-legacy",
        "classProperties",
        "objectRestSpread",
      ],
    });

    let helpSectionNode: t.ObjectExpression | null = null;

    traverse(ast, {
      VariableDeclarator(path) {
        if (
          t.isIdentifier(path.node.id) &&
          path.node.id.name.endsWith("Help") &&
          t.isObjectExpression(path.node.init)
        ) {
          helpSectionNode = path.node.init;
        }
      },
    });

    if (!helpSectionNode) {
      console.warn(`Could not find help section object in ${filePath}`);
      return chunks;
    }

    // Extract title
    const titleProp = helpSectionNode.properties.find(
      (p) =>
        t.isObjectProperty(p) &&
        t.isIdentifier(p.key) &&
        p.key.name === "title"
    ) as t.ObjectProperty | undefined;

    if (titleProp && t.isStringLiteral(titleProp.value)) {
      chunks.push({
        id: `${language}-${section}-title`,
        text: titleProp.value.value,
        metadata: {
          section,
          language,
          type: "title",
        },
      });
    }

    // Extract description
    const descriptionProp = helpSectionNode.properties.find(
      (p) =>
        t.isObjectProperty(p) &&
        t.isIdentifier(p.key) &&
        p.key.name === "description"
    ) as t.ObjectProperty | undefined;

    if (descriptionProp) {
      const descriptionText = extractTextFromJSX(descriptionProp.value);
      if (descriptionText) {
        chunks.push({
          id: `${language}-${section}-description`,
          text: descriptionText,
          metadata: {
            section,
            language,
            type: "description",
          },
        });
      }
    }

    // Extract features
    const featuresProp = helpSectionNode.properties.find(
      (p) =>
        t.isObjectProperty(p) &&
        t.isIdentifier(p.key) &&
        p.key.name === "features"
    ) as t.ObjectProperty | undefined;

    if (featuresProp && t.isArrayExpression(featuresProp.value)) {
      featuresProp.value.elements.forEach((element, index) => {
        if (
          t.isObjectExpression(element) &&
          element !== null &&
          !t.isSpreadElement(element)
        ) {
          const titleProp = element.properties.find(
            (p) =>
              t.isObjectProperty(p) &&
              t.isIdentifier(p.key) &&
              p.key.name === "title"
          ) as t.ObjectProperty | undefined;

          const descriptionProp = element.properties.find(
            (p) =>
              t.isObjectProperty(p) &&
              t.isIdentifier(p.key) &&
              p.key.name === "description"
          ) as t.ObjectProperty | undefined;

          if (titleProp && t.isStringLiteral(titleProp.value)) {
            const title = titleProp.value.value;
            const description = descriptionProp
              ? extractTextFromJSX(descriptionProp.value)
              : "";

            chunks.push({
              id: `${language}-${section}-feature-${index}`,
              text: `${title}${description ? `: ${description}` : ""}`,
              metadata: {
                section,
                language,
                type: "feature",
                feature: title,
              },
            });
          }
        }
      });
    }

    // Extract sections
    const sectionsProp = helpSectionNode.properties.find(
      (p) =>
        t.isObjectProperty(p) &&
        t.isIdentifier(p.key) &&
        p.key.name === "sections"
    ) as t.ObjectProperty | undefined;

    if (sectionsProp && t.isArrayExpression(sectionsProp.value)) {
      sectionsProp.value.elements.forEach((element, index) => {
        if (
          t.isObjectExpression(element) &&
          element !== null &&
          !t.isSpreadElement(element)
        ) {
          const titleProp = element.properties.find(
            (p) =>
              t.isObjectProperty(p) &&
              t.isIdentifier(p.key) &&
              p.key.name === "title"
          ) as t.ObjectProperty | undefined;

          const contentProp = element.properties.find(
            (p) =>
              t.isObjectProperty(p) &&
              t.isIdentifier(p.key) &&
              p.key.name === "content"
          ) as t.ObjectProperty | undefined;

          if (titleProp && t.isStringLiteral(titleProp.value)) {
            const title = titleProp.value.value;
            const content = contentProp
              ? extractTextFromJSX(contentProp.value)
              : "";

            if (content) {
              chunks.push({
                id: `${language}-${section}-section-${index}`,
                text: `${title}\n${content}`,
                metadata: {
                  section,
                  language,
                  type: "section",
                },
              });
            }
          }
        }
      });
    }

    // Extract screenshot captions
    const screenshotsProp = helpSectionNode.properties.find(
      (p) =>
        t.isObjectProperty(p) &&
        t.isIdentifier(p.key) &&
        p.key.name === "screenshots"
    ) as t.ObjectProperty | undefined;

    if (screenshotsProp && t.isArrayExpression(screenshotsProp.value)) {
      screenshotsProp.value.elements.forEach((element, index) => {
        if (
          t.isObjectExpression(element) &&
          element !== null &&
          !t.isSpreadElement(element)
        ) {
          const captionProp = element.properties.find(
            (p) =>
              t.isObjectProperty(p) &&
              t.isIdentifier(p.key) &&
              p.key.name === "caption"
          ) as t.ObjectProperty | undefined;

          if (captionProp && t.isStringLiteral(captionProp.value)) {
            chunks.push({
              id: `${language}-${section}-screenshot-${index}`,
              text: captionProp.value.value,
              metadata: {
                section,
                language,
                type: "screenshot",
              },
            });
          }
        }
      });
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }

  return chunks;
}

/**
 * Main extraction function
 */
async function extractHelpContent() {
  const helpContentDir = join(
    __dirname,
    "../apps/frontend/src/components/contextual-help"
  );
  const outputDir = join(__dirname, "../apps/frontend/public/embeddings");
  const outputFile = join(outputDir, "help-content.json");

  const allChunks: HelpChunk[] = [];

  // Process English and Portuguese help files
  for (const language of ["en", "pt"]) {
    const langDir = join(helpContentDir, language);
    const files = await readdir(langDir);

    for (const file of files) {
      if (file.endsWith(".tsx") && file !== "default.tsx") {
        const section = file.replace(".tsx", "");
        const filePath = join(langDir, file);
        const chunks = await processHelpFile(filePath, language, section);
        allChunks.push(...chunks);
        console.log(
          `Extracted ${chunks.length} chunks from ${language}/${file}`
        );
      }
    }
  }

  // Also process default.tsx files
  for (const language of ["en", "pt"]) {
    const defaultFile = join(helpContentDir, language, "default.tsx");
    try {
      const chunks = await processHelpFile(defaultFile, language, "default");
      allChunks.push(...chunks);
      console.log(
        `Extracted ${chunks.length} chunks from ${language}/default.tsx`
      );
    } catch (error) {
      // File might not exist, that's okay
    }
  }

  const output: ExtractedContent = {
    chunks: allChunks,
  };

  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  // Write output file
  await writeFile(outputFile, JSON.stringify(output, null, 2), "utf-8");

  console.log(
    `\nExtraction complete! Generated ${allChunks.length} chunks in ${outputFile}`
  );
}

// Run extraction
extractHelpContent().catch((error) => {
  console.error("Extraction failed:", error);
  process.exit(1);
});

