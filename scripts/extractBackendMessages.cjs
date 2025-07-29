#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Extract translatable messages from backend code
 * This script finds all createTranslatedError calls and extracts the message strings
 */
function extractBackendMessages() {
  const backendDir = path.join(__dirname, '../apps/backend/src');
  const businessLogicDir = path.join(__dirname, '../libs/business-logic/src');
  
  // Find all TypeScript files
  const backendFiles = glob.sync('**/*.ts', { cwd: backendDir, absolute: true });
  const businessLogicFiles = glob.sync('**/*.ts', { cwd: businessLogicDir, absolute: true });
  
  const allFiles = [...backendFiles, ...businessLogicFiles];
  const messages = new Set();
  
  // Regex to find createTranslatedError calls
  const createTranslatedErrorRegex = /createTranslatedError\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*['"`]([^'"`]+)['"`]/g;
  
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    
    while ((match = createTranslatedErrorRegex.exec(content)) !== null) {
      const message = match[2];
      messages.add(message);
    }
  });
  
  return Array.from(messages).sort();
}

/**
 * Update the .po files with extracted messages
 */
function updatePoFiles(messages) {
  const localesDir = path.join(__dirname, '../apps/backend/src/locales');
  const enPoFile = path.join(localesDir, 'en/messages.po');
  const ptPoFile = path.join(localesDir, 'pt/messages.po');
  
  // Read existing messages
  const existingEnMessages = readPoFile(enPoFile);
  const existingPtMessages = readPoFile(ptPoFile);
  
  // Add new messages
  messages.forEach(message => {
    if (!existingEnMessages.has(message)) {
      existingEnMessages.add(message);
    }
    if (!existingPtMessages.has(message)) {
      existingPtMessages.add(message);
    }
  });
  
  // Write updated files
  writePoFile(enPoFile, Array.from(existingEnMessages).sort());
  writePoFile(ptPoFile, Array.from(existingPtMessages).sort());
  
  console.log(`✅ Extracted ${messages.length} messages from backend code`);
  console.log(`📝 Updated ${enPoFile}`);
  console.log(`📝 Updated ${ptPoFile}`);
}

/**
 * Read existing messages from a .po file
 */
function readPoFile(poFile) {
  if (!fs.existsSync(poFile)) {
    return new Set();
  }
  
  const content = fs.readFileSync(poFile, 'utf8');
  const messages = new Set();
  
  // Extract msgid values
  const msgidRegex = /^msgid\s+"([^"]+)"$/gm;
  let match;
  
  while ((match = msgidRegex.exec(content)) !== null) {
    const message = match[1];
    if (message && message !== '') {
      messages.add(message);
    }
  }
  
  return messages;
}

/**
 * Write messages to a .po file
 */
function writePoFile(poFile, messages) {
  const dir = path.dirname(poFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  let content = `msgid ""
msgstr ""
"POT-Creation-Date: ${new Date().toISOString()}\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=utf-8\n"
"Content-Transfer-Encoding: 8bit\n"
"X-Generator: @lingui/cli\n"
"Language: ${path.basename(dir)}\n"
"Project-Id-Version: \n"
"Report-Msgid-Bugs-To: \n"
"PO-Revision-Date: \n"
"Last-Translator: \n"
"Language-Team: \n"
"Plural-Forms: \n"

`;
  
  messages.forEach(message => {
    content += `msgid "${message}"\n`;
    content += `msgstr "${message}"\n\n`;
  });
  
  fs.writeFileSync(poFile, content);
}

// Run the extraction
if (require.main === module) {
  try {
    const messages = extractBackendMessages();
    updatePoFiles(messages);
  } catch (error) {
    console.error('❌ Error extracting messages:', error);
    process.exit(1);
  }
}

module.exports = { extractBackendMessages, updatePoFiles }; 