// @ts-check

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function generateRandomString() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const length = 32;
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

function updateEnvFile(env, envPath = "") {
  const dotEnvFile = ".env";
  const file = join(process.cwd(), envPath, dotEnvFile);
  let content = "";
  let read = false;
  let created = false;
  for (const [key, value] of Object.entries(env)) {
    const line = `${key}="${value}"`;
    try {
      if (!read) {
        content = readFileSync(file, "utf-8");
        read = true;
      }
      if (!content.includes(`${key}=`)) {
        console.log(`➕ Added \`${key}\` to ${file}.`);
        content = content ? `${content}\n${line}` : line;
      } else {
        console.log(`✨ Updated \`${key}\` in ${file}.`);
        content = content.replace(new RegExp(`${key}=(.*)`), `${line}`);
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        if (!created) {
          console.log(`📝 Created ${file} with \`${key}\`.`);
          created = true;
        } else {
          console.log(`➕ Added \`${key}\` to ${file}.`);
        }
        content = content ? `${content}\n${line}` : line;
      } else {
        throw error;
      }
    }
  }
  if (content) writeFileSync(file, content);
}

updateEnvFile({
  AUTH_SECRET: generateRandomString(),
  GOOGLE_CLIENT_ID: "your-google-client-id-here",
  GOOGLE_CLIENT_SECRET: "your-google-client-secret-here",
});
