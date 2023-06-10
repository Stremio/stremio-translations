const path = require('path');
const fs = require('fs');
const { deduplicate } = require('./utils');

const rootPath = 'android/src/commonMain/kotlin/com/stremio/translations';
const stringsPath = path.join(rootPath, 'strings');
const packageName = 'com.stremio.translations';

fs.mkdirSync(path.join(process.cwd(), rootPath), { recursive: true });
fs.mkdirSync(path.join(process.cwd(), stringsPath), { recursive: true });

const files = fs.readdirSync(process.cwd()).filter(file => /[a-z]{2}-[A-Z]{2}\.json$/g.test(file));

const escape = str => str
  .replaceAll('\\', '\\\\')
  .replaceAll('"', '\\"')
  .replaceAll('\n', '\\n')
  .replaceAll('%', '%%')
  .replaceAll(/\${\d+}/gm, '%s');

function writeDataClass() {
  const defaultTranslation = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'en-US.json')));
  let stringClass = `package ${packageName}\n\n`;
  stringClass += 'internal data class Strings(\n';
  const dedup = deduplicate(defaultTranslation);
  Object.keys(dedup).forEach(key => stringClass += `  val ${key}: String,\n`);
  stringClass += ')';
  fs.writeFileSync(path.join(process.cwd(), rootPath, 'Strings.kt'), stringClass);
}

function writeLocales() {
  let stringClass = `package ${packageName}\n\n`;
  stringClass += 'object Locales {\n';
  const locales = new Set(files.map(file => file.split('-')[0]));
  locales.forEach(locale => stringClass += `  const val ${locale.toUpperCase()} = "${locale}"\n`);
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
      stringClass += `@LyricistStrings(languageTag = Locales.${file.split('-')[0].toUpperCase()}, default = ${langClassName === 'EnUSStrings' ? 'true' : 'false'})\n`;
      stringClass += `internal val ${langClassName} = Strings(\n`;
      const dedup = deduplicate(translations);
      Object.keys(dedup).forEach(key => {
        const value = escape(dedup[key]);
        stringClass += `  ${key} = "${value}",\n`;
      });
      stringClass += ')';
      fs.writeFileSync(path.join(process.cwd(), stringsPath, `${langClassName}.kt`), stringClass);
    })
}

writeDataClass();
writeLocales();
writeTranslations();
