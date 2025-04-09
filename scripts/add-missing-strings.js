#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

// Configuration
const MISSING_PREFIX = "MISSING_TRANSLATION ";
const COMMON_EXCEPTIONS = [
  // Brand names and proper nouns
  "Stremio", "YouTube", "IMDb", "Netflix", "Trakt", "VLC", "Plex", "Kodi",
  "Chromecast", "Facebook", "Twitter", "BitTorrent", "GitHub", "Android",
  "iOS", "Windows", "macOS", "Linux", "HD", "4K", "WiFi", "URL", "HTTP",
  "HLS", "EP", "API", "SDK", "VPN", "DNS", "HTML", "CSS", "JS", "MP4",
  "MKV", "AVI", "MP3", "AAC", "H.264", "H.265", "HEVC", "Dolby", "DTS",
  "Android TV", "Fire TV", "Apple TV", "Roku", "Smart TV", "AirPlay", "DLNA",
  // Common technical terms
  "cache", "stream", "torrent", "addon", "addons", "metadata",
  // UI elements often kept in English
  "Series", "Video", "Error", "Director", "Similar", "Sensor", "Audio",
  "a-z", "z-a", "Top", "No", "16:9", "4:3", "Original", "Personal",
  "General", "Shift", "Esc", "Drama", "Musical", "Bikini babe", "Legal", "Local"
];

// Precompute lowercase exceptions for case-insensitive comparison
const COMMON_EXCEPTIONS_LC = COMMON_EXCEPTIONS.map(word => word.toLowerCase());

function shouldSkipTranslation(englishValue) {
  // Remove case-insensitive check to preserve original case
  return COMMON_EXCEPTIONS.some(word => englishValue.includes(word));
}

// Read and parse source language file (en-US)
const enPath = path.resolve(process.cwd(), "en-US.json");  // Changed to uppercase "US"
let en, enContent, enLines;
try {
  enContent = fs.readFileSync(enPath, "utf8");
  en = JSON.parse(enContent);
  enLines = enContent.split(/\r?\n/);
} catch (err) {
  console.error(`Error reading/parsing ${enPath}:`, err.message);
  process.exit(1);
}

// Get ordered keys from original file
const enKeys = [];
enLines.forEach((line) => {
  const keyMatch = line.match(/^\s*"([^"]+)"\s*:/);
  if (keyMatch) enKeys.push(keyMatch[1]);
});

// Read and parse target language file
if (!process.argv[2]) {
  console.error("Error: Target file path argument is missing");
  process.exit(1);
}

const targetPath = path.resolve(process.cwd(), process.argv[2]);

// Prevent modifying en-US.json
if (path.basename(targetPath).toLowerCase() === 'en-us.json') {  // Changed to lowercase check
  console.error("Error: Cannot modify en-US.json - this is the source file");
  process.exit(1);
}

console.log(`Syncing translations for ${targetPath}`);

let targetContent, target;
try {
  targetContent = fs.existsSync(targetPath) ? fs.readFileSync(targetPath, "utf8") : "{}";
  target = JSON.parse(targetContent);
} catch (err) {
  console.error(`Error reading/parsing ${targetPath}:`, err.message);
  process.exit(1);
}

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
    const englishValue = JSON.parse(originalValue);

    if (!translatedValue || (!shouldSkipTranslation(englishValue) && translatedValue === englishValue)) {
      if (englishValue == "") {
        translatedValue = englishValue;
      } else {
        translatedValue = MISSING_PREFIX + englishValue;
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
  const englishValue = en[key];
  const shouldSkip = shouldSkipTranslation(englishValue);

  if (!target[key] || (!shouldSkip && target[key] === englishValue)) {
    const translatedValue = MISSING_PREFIX + englishValue;
    outputLines.push(
      `  "${key}": ${JSON.stringify(translatedValue)}${index === enKeys.length - 1 ? "" : ","}`
    );
    missingCount++;
  }
});

// Write results
if (missingCount > 0) {
  console.log(`Added ${missingCount} missing translations`);
  try {
    fs.writeFileSync(targetPath, outputLines.join("\n"));
    console.log("File updated successfully");
  } catch (err) {
    console.error(`Error writing to ${targetPath}:`, err.message);
    process.exit(1);
  }
} else {
  console.log("No missing translations found");
}
