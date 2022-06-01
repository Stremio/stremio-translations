var path = require('path');
var fs = require('fs');

var files = fs.readdirSync(process.cwd());

fs.mkdirSync(path.join(process.cwd(), 'build'), { recursive: true });

var defaultLang = 'en-rUS';

function str2xml(str) {

	var textVars = ['{{[^}]+}}', '\\$ ?{[\\d]+}', '\\#{[^}]+}'];
	var newLines = ['<\\/?br ?\\/?>'];
	var replacers = {
		' \\& ': ' &amp; ', // replace "&" with html entity
		'\\.\\.\\.': '&#8230;', // replace "..." with html entity
		'\\&nbsp\\;': ' ',  // replace "&nbsp;" with space
		'\\&raquo\\;': '»', // replace "&raquo;" with »
		"\\'": "\\\\\\'", // escape quotes
		'\\"': '\\\\\\"', // escape quotes
		'\\?': '\\\\\\?', // escape question marks
		'<[^>]*>?': '', // strip html elements
	};

	textVars.forEach(el => { str = str.replace(new RegExp(el, 'gm'), '%s') });
	newLines.forEach(el => { str = str.replace(new RegExp(el, 'gm'), '\n') });
	Object.keys(replacers).forEach(key => { str = str.replace(new RegExp(key, 'gm'), replacers[key]) });
	return str;
}

function slug(str) {
	// can't start with number
	if (/^\d/.test(str)) return false;
	// can't include colons
	if (/\:/.test(str)) return false;
	str = str.split(' ').join('_');
	str = str.split('&').join('_');
	str = str.split('-').join('_');
	str = str.replace(/__+/g, '_');
	return 'label_'+str;
}

files.forEach(function(file) {
	if (/[a-z][a-z]-[A-Z][A-Z]\.json$/g.test(file)) {
		var lang = file.split('-')[0];
		var region = file.split('-')[1].replace('.json', '');
		var langTag = lang + '-r' + region;
		var translations = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)));
		var langFolder = 'values' + (langTag !== defaultLang ? '-' + langTag : '');
		fs.mkdirSync(path.join(process.cwd(), 'build', langFolder), { recursive: true });
		var xml = '<?xml version="1.0" encoding="utf-8"?>\n';
		xml += '<resources>\n';
		var dedup = {};
		Object.keys(translations).filter(key => slug(key)).forEach(key => dedup[slug(key.toLowerCase())] = translations[key]);
		Object.keys(dedup).forEach(key => {
			xml += '  <string name="'+key+'">'+str2xml(dedup[key])+'</string>\n';
		});
		xml += '</resources>';
		fs.writeFileSync(path.join(process.cwd(), 'build', langFolder, 'strings.xml'), xml);
	}
})