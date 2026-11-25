const path = require('path');
const fs = require('fs');
const { deduplicate, filter } = require('./utils');
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
  stringClass += 'interface Strings{\n';
  const dedup = deduplicate(defaultTranslation);
  const filtered = filter(dedup);
  Object.keys(filtered).forEach(key => stringClass += `  val ${key}: String\n`);
  stringClass += '  val entries: Map<String, String>\n';
  stringClass += '}';
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
  let stringClass = `package ${packageName}\n\n`;
  stringClass += 'import com.stremio.translations.Locales\n';
  files.forEach(file => stringClass += `import com.stremio.translations.${toClassName(file)}\n`);
  stringClass += '\n';
  stringClass += 'val stremioTranslations = mapOf(\n';
  stringClass += files.map(file => `  Locales.${toLocaleName(file)} to ${toClassName(file)}`).join(',\n');
  stringClass += ',\n)';
  fs.writeFileSync(path.join(process.cwd(), rootPath, 'Translations.kt'), stringClass);
}

function writeStrings() {
  files
    .forEach(file => {
      const langClassName = toClassName(file);
      const translations = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)));
      let stringClass = `package ${packageName}\n\n`;
      stringClass += 'import cafe.adriel.lyricist.LyricistStrings\n\n';
      stringClass += `class ${langClassName}Class : Strings {\n`;
      const dedup = deduplicate(translations);
      const filtered = filter(dedup);
      Object.keys(filtered).forEach(key => {
        const value = escape(dedup[key]);
        stringClass += `  override val ${key} = "${value}"\n`;
      });

      stringClass += '  override val entries get() = ENTRIES\n'
      stringClass += '  companion object {\n';
      stringClass += '    private val ENTRIES = mapOf(\n';
      Object.entries(filtered).forEach(([key, value]) => {
        stringClass += `      Pair("${key}", "${escape(value)}"),\n`;
      });
      stringClass += '    )\n';
      stringClass += '  }\n';
      stringClass += '}\n\n';
      stringClass += `@LyricistStrings(languageTag = Locales.${toLocaleName(file)}, default = ${langClassName === 'EnUSStrings' ? 'true' : 'false'})\n`;
      stringClass += `val ${langClassName} = ${langClassName}Class()`;
      fs.writeFileSync(path.join(process.cwd(), stringsPath, `${langClassName}.kt`), stringClass);
    })
}

function toLocaleName(file) {
  return fileName(file).replace('-', '_').toUpperCase();
}

function fileName(file) {
  return file.split('.')[0];
}

function toClassName(file) {
  return file.replace(/(\w\w)-(\w\w)\.json/, (_, p1, p2) => `${p1.charAt(0).toUpperCase() + p1.slice(1)}${p2}Strings`);
}

writeDataClass();
writeLocales();
writeStrings();
writeTranslations();
