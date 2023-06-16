const path = require('path');
const fs = require('fs');
const { deduplicate } = require('./utils');
const {
  escapePercentageSign,
  replaceNbspToSpace,
  replaceRightDoubleAngleQuote,
  stripHtmlElements,
  replaceTextVariables,
  replaceBr
} = require('./sanitize');

const rootPath = 'android/src/commonMain/kotlin/com/stremio/translations';
const stringsPath = path.join(rootPath, 'strings');
const packageName = 'com.stremio.translations';

fs.mkdirSync(path.join(process.cwd(), rootPath), { recursive: true });
fs.mkdirSync(path.join(process.cwd(), stringsPath), { recursive: true });

const files = fs.readdirSync(process.cwd()).filter(file => /[a-z]{2}-[A-Z]{2}\.json$/g.test(file));

const escape = str => {
	str = replaceNbspToSpace(str);
	str = replaceRightDoubleAngleQuote(str);
	str = escapePercentageSign(str);
	str = stripHtmlElements(str);
	str = replaceTextVariables(str);
	str = replaceBr(str);
  return str
    .replace(/\\/gm, '\\\\')
    .replace(/"/gm, '\\"')
    .replace(/\n/gm, '\\n');
}

function writeDataClass() {
  const defaultTranslation = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'en-US.json')));
  let stringClass = `package ${packageName}\n\n`;
  stringClass += 'data class Strings(\n';
  const dedup = deduplicate(defaultTranslation);
  Object.keys(dedup).forEach(key => stringClass += `  val ${key}: String,\n`);
  stringClass += ')';
  fs.writeFileSync(path.join(process.cwd(), rootPath, 'Strings.kt'), stringClass);
}

function writeLocales() {
  let stringClass = `package ${packageName}\n\n`;
  stringClass += 'object Locales {\n';
  files.forEach(file => stringClass += `  const val ${toLocaleName(file)} = "${fileName(file)}"\n`);
  stringClass += '}';
  fs.writeFileSync(path.join(process.cwd(), rootPath, 'Locales.kt'), stringClass);
}

function writeTranslations() {
  files
    .forEach(file => {
      const langClassName = file.replace(/(\w\w)-(\w\w)\.json/, (_, p1, p2) => `${p1.charAt(0).toUpperCase() + p1.slice(1)}${p2}Strings`);
      const translations = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)));
      let stringClass = `package ${packageName}\n\n`;
      stringClass += 'import cafe.adriel.lyricist.LyricistStrings\n\n';
      stringClass += `@LyricistStrings(languageTag = Locales.${toLocaleName(file)}, default = ${langClassName === 'EnUSStrings' ? 'true' : 'false'})\n`;
      stringClass += `val ${langClassName} = Strings(\n`;
      const dedup = deduplicate(translations);
      Object.keys(dedup).forEach(key => {
        const value = escape(dedup[key]);
        stringClass += `  ${key} = "${value}",\n`;
      });
      stringClass += ')';
      fs.writeFileSync(path.join(process.cwd(), stringsPath, `${langClassName}.kt`), stringClass);
    })
}

function toLocaleName(file) {
  return fileName(file).replace('-', '_').toUpperCase();
}

function fileName(file) {
  return file.split('.')[0];
}

writeDataClass();
writeLocales();
writeTranslations();
