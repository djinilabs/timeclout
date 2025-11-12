import { writeFile, mkdir, access } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { constants } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MODEL_NAME = "Xenova/all-MiniLM-L6-v2";
const MODEL_DIR = join(__dirname, "../apps/frontend/public/models", MODEL_NAME);

// Files needed for the model
// Note: Model files are in the onnx/ subdirectory
const MODEL_FILES = [
  "config.json",
  "tokenizer.json",
  "tokenizer_config.json",
  "vocab.txt",
  "onnx/model_quantized.onnx", // Quantized model is smaller, located in onnx/ subdirectory
];

/**
 * Check if a file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Download a file from Hugging Face
 */
async function downloadFile(url: string, outputPath: string, skipIfExists: boolean = true): Promise<void> {
  // Skip if file already exists
  if (skipIfExists && await fileExists(outputPath)) {
    console.log(`✓ Skipping ${outputPath} (already exists)`);
    return;
  }

  console.log(`Downloading ${url}...`);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  // Create directory if it doesn't exist
  await mkdir(dirname(outputPath), { recursive: true });

  // Convert web stream to Node.js stream
  if (!response.body) {
    throw new Error(`No response body for ${url}`);
  }

  // For Node.js, we need to convert the web ReadableStream
  const chunks: Uint8Array[] = [];
  const reader = response.body.getReader();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  // Combine chunks and write to file
  const buffer = Buffer.concat(chunks);
  await writeFile(outputPath, buffer);
  
  console.log(`✓ Downloaded ${outputPath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

/**
 * Download all model files from Hugging Face
 */
async function downloadModel(): Promise<void> {
  console.log(`Downloading model: ${MODEL_NAME}`);
  console.log(`Output directory: ${MODEL_DIR}`);
  
  // Create model directory
  await mkdir(MODEL_DIR, { recursive: true });

  // Download each file
  for (const file of MODEL_FILES) {
    const url = `https://huggingface.co/${MODEL_NAME}/resolve/main/${file}`;
    // Preserve directory structure (e.g., onnx/model_quantized.onnx -> onnx/model_quantized.onnx)
    const outputPath = join(MODEL_DIR, file);
    
    try {
      await downloadFile(url, outputPath);
    } catch (error) {
      console.error(`Error downloading ${file}:`, error);
      throw error;
    }
  }

  // Create a manifest file with model info
  const manifest = {
    model: MODEL_NAME,
    files: MODEL_FILES,
    downloadedAt: new Date().toISOString(),
  };
  
  await writeFile(
    join(MODEL_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\n✓ Model downloaded successfully!`);
  console.log(`  Location: ${MODEL_DIR}`);
  console.log(`  Files: ${MODEL_FILES.length}`);
}

// Run the download
downloadModel().catch((error) => {
  console.error("Failed to download model:", error);
  process.exit(1);
});

