const path = require('path');
const fs = require('fs');

const rootPath = 'android/src/main/res'
const files = fs.readdirSync(process.cwd())

fs.mkdirSync(path.join(process.cwd(), rootPath), { recursive: true });

const defaultLang = 'en-rUS';

const escapeXmlString = str => {

	const textVars = ['{{[^}]+}}', '\\$ ?{[\\d]+}', '\\#{[^}]+}'];
	const newLines = ['<\\/?br ?\\/?>'];
	const replacers = {
		' \\& ': ' &amp; ', // replace "&" with html entity
		'\\.\\.\\.': '&#8230;', // replace "..." with html entity
		'\\&nbsp\\;': ' ',  // replace "&nbsp;" with space
		'\\&raquo\\;': '»', // replace "&raquo;" with »
		"\\'": "\\\'", // escape quotes
		'\\?': '\\\?', // escape question marks
		'<[^>]*>?': '', // strip html elements
	};

	textVars.forEach(el => { str = str.replace(new RegExp(el, 'gm'), '%s') });
	newLines.forEach(el => { str = str.replace(new RegExp(el, 'gm'), '\n') });
	Object.keys(replacers).forEach(key => { str = str.replace(new RegExp(key, 'gm'), replacers[key]) });
	return str;
}

const slug = str => {
	// can't start with number
	if (/^\d/.test(str)) return false;
	// can't include colons
	if (/\:/.test(str)) return false;
	str = str.replace(/[ &-]+/g, '_')
	str = str.replace(/__+/g, '_');
	return `label_${str}`;
}

files
	.filter(file => /[a-z]{2}-[A-Z]{2}\.json$/g.test(file))
	.forEach(file => {
		const langTag = file.replace(/(\w\w-)(\w\w)\.json/,'$1r$2');
		const translations = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)));
		let langFolder = 'values';
		if (langTag !== defaultLang) langFolder += `-${langTag}`;
		fs.mkdirSync(path.join(process.cwd(), rootPath, langFolder), { recursive: true });
		let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
		xml += '<resources>\n';
		const dedup = {};
		Object.keys(translations).filter(key => slug(key)).forEach(key => dedup[slug(key.toLowerCase())] = translations[key]);
		Object.keys(dedup).forEach(key => {
			xml += `  <string name="${key}">${escapeXmlString(dedup[key])}</string>\n`;
		});
		xml += '</resources>';
		fs.writeFileSync(path.join(process.cwd(), rootPath, langFolder, 'strings.xml'), xml);
	})
