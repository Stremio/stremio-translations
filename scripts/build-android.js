var path = require('path');
var fs = require('fs');

var files = fs.readdirSync(process.cwd());

fs.mkdirSync(path.join(process.cwd(), 'build'), { recursive: true });

var defaultLang = 'en-rUS';

function str2xml(str) {
	// replace string vars
	str = str.replace(/{{[^}]+}}/gm, '%s');
	// replace new lines
	str = str.replace(/<br ?\/?>/gm, '\n');
	// replace "&" with html entity
	str = str.replace(/ \& /gm, ' &amp; ');
	return str;
}

function slug(str) {
	str = str.split(' ').join('_');
	str = str.split('&').join('_');
	str = str.replace(/__+/g, '_');
	return str;
}

files.forEach(function(file) {
	if (/[a-z][a-z]-[A-Z][A-Z]\.json$/g.test(file)) {
		var lang = file.split('-')[0];
		var region = file.split('-')[1].replace('.json', '');
		var langTag = lang + '-r' + region;
		var translations = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)));
		var langFolder = 'values' + (langTag !== defaultLang ? '-' + langTag : '');
		fs.mkdirSync(path.join(process.cwd(), 'build', langFolder), { recursive: true });
		let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
		xml += '<resources>\n';
		Object.keys(translations).forEach(key => {
			xml += '  <string name="'+slug(key.toLowerCase())+'">'+str2xml(translations[key])+'</string>\n';
		})
		xml += '</resources>';
		fs.writeFileSync(path.join(process.cwd(), 'build', langFolder, 'strings.xml'), xml);
	}
})