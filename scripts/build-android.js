const path = require('path');
const fs = require('fs');
const { deduplicate, filter } = require('./utils');
const {
	escapePercentageSign,
	escapeQuestionMark,
	escapeSingleQuote,
	replaceAmpershandHtmlEntity,
	replaceElipsisHtmlEntity,
	replaceNbspToSpace,
	replaceRightDoubleAngleQuote,
	stripHtmlElements,
	replaceTextVariables,
	replaceBr
} = require('./sanitize');

const rootPath = 'android/src/androidMain/res'
const files = fs.readdirSync(process.cwd()).filter(file => /[a-z]{2}-[A-Z]{2}\.json$/g.test(file));

fs.mkdirSync(path.join(process.cwd(), rootPath), { recursive: true });

const defaultLang = 'en-rUS';
const duplicatedLanguages = { 'he-rIL': 'iw-rIL'}

const escapeXmlString = str => {
	str = replaceAmpershandHtmlEntity(str);
	str = replaceElipsisHtmlEntity(str);
	str = replaceNbspToSpace(str);
	str = replaceRightDoubleAngleQuote(str);
	str = escapeSingleQuote(str);
	str = escapePercentageSign(str);
	str = escapeQuestionMark(str);
	str = stripHtmlElements(str);
	str = replaceTextVariables(str);
	str = replaceBr(str);
	return str;
}

function writeLocales() {
	let resource = '<?xml version="1.0" encoding="utf-8"?>\n';
	resource +='<resources>\n'
	resource += '    <string-array name="interface_locales" translatable="false">\n'
	files.forEach(file => resource += `        <item>${file.split('.').shift()}</item>\n`);
	resource += '    </string-array>\n';
	resource += '</resources>';
	fs.mkdirSync(path.join(process.cwd(), rootPath, 'values'));
	fs.writeFileSync(path.join(process.cwd(), rootPath, 'values', 'array.xml'), resource);
}

function writeTranslations() {
	files
		.forEach(file => {
			const langTag = file.replace(/(\w\w-)(\w\w)\.json/, '$1r$2');
			const translations = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)));
			let langFolder = 'values';
			if (langTag !== defaultLang) langFolder += `-${langTag}`;
			let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
			xml += '<resources>\n';
			const dedup = deduplicate(translations);
			const filtered = filter(dedup);
			Object.keys(filtered).forEach(key => {
				xml += `  <string name="${key}">${escapeXmlString(filtered[key])}</string>\n`;
			});
			xml += '</resources>';
			fs.mkdirSync(path.join(process.cwd(), rootPath, langFolder), { recursive: true });
			fs.writeFileSync(path.join(process.cwd(), rootPath, langFolder, 'strings.xml'), xml);
			if (duplicatedLanguages[langTag]) {
				langFolder = `values-${duplicatedLanguages[langTag]}`
				fs.mkdirSync(path.join(process.cwd(), rootPath, langFolder), { recursive: true });
				fs.writeFileSync(path.join(process.cwd(), rootPath, langFolder, 'strings.xml'), xml);
			}
		})
}

writeLocales()
writeTranslations()
