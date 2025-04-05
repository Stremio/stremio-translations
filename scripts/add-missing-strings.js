#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

// Configuration
const MISSING_PREFIX = "MISSING_TRANSLATION ";

// Read and parse source language file (en-US)
const enPath = path.resolve(process.cwd(), "en-US.json");
const enContent = fs.readFileSync(enPath, "utf8");
const enLines = enContent.split(/\r?\n/);
const en = JSON.parse(enContent);

// Get ordered keys from original file
const enKeys = [];
enLines.forEach((line) => {
  const keyMatch = line.match(/^\s*"([^"]+)"\s*:/);
  if (keyMatch) enKeys.push(keyMatch[1]);
});

// Read and parse target language file
const targetPath = path.resolve(process.cwd(), process.argv[2]);
console.log(`Syncing translations for ${targetPath}`);
const targetContent = fs.existsSync(targetPath)
  ? fs.readFileSync(targetPath, "utf8")
  : "{}";
const target = JSON.parse(targetContent);

// Process lines
let missingCount = 0;
const outputLines = [];
let lastKeyIndex = -1;

enLines.forEach((line) => {
  const trimmed = line.trim();

  // Preserve empty lines and structural elements
  if (trimmed === "" || trimmed === "{" || trimmed === "}") {
    outputLines.push(line);
    return;
  }

  // Process key-value lines
  const keyMatch = line.match(/^(\s*)"([^"]+)"\s*:\s*(.*?)(,?)\s*$/);
  if (keyMatch) {
    const [, indent, key, originalValue] = keyMatch;
    const isLastKey = enKeys.indexOf(key) === enKeys.length - 1;
    lastKeyIndex = enKeys.indexOf(key);

    // Get translation or mark missing
    let translatedValue = target[key];
    if (!translatedValue) {
      if (en[key] == "") {
        translatedValue = JSON.parse(originalValue);
      } else {
        translatedValue = MISSING_PREFIX + JSON.parse(originalValue);
      }
      missingCount++;
    }

    // Build new line with proper comma
    const newLine = `${indent}"${key}": ${JSON.stringify(translatedValue)}${isLastKey ? "" : ","}`;
    outputLines.push(newLine);
  } else {
    outputLines.push(line);
  }
});

// Handle missing keys at the end (if any)
enKeys.forEach((key, index) => {
  if (index <= lastKeyIndex) return;
  if (!target[key]) {
    const translatedValue = MISSING_PREFIX + en[key];
    outputLines.push(
      `  "${key}": ${JSON.stringify(translatedValue)}${index === enKeys.length - 1 ? "" : ","}`,
    );
    missingCount++;
  }
});

// Write results
if (missingCount > 0) {
  console.log(`Added ${missingCount} missing translations`);
  fs.writeFileSync(targetPath, outputLines.join("\n"));
  console.log("File updated successfully");
} else {
  console.log("No missing translations found");
}
