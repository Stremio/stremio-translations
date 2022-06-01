var path = require('path');
var fs = require('fs');

var files = fs.readdirSync(process.cwd());

fs.mkdirSync(path.join(process.cwd(), 'build'), { recursive: true });

var defaultLang = 'en-rUS';

function startsWithNumber(str) {
  return /^\d/.test(str);
}

function str2xml(str) {
	// replace string vars
	str = str.replace(/{{[^}]+}}/gm, '%s');
	str = str.replace(/\$ ?{[\d]+}/gm, '%s');
	str = str.replace(/\#{[^}]+}/gm, '%s');
	// replace new lines
	str = str.replace(/<\/?br ?\/?>/gm, '\n');
	// replace "&" with html entity
	str = str.replace(/ \& /gm, ' &amp; ');
	str = str.replace(/.../gm, '&#8230;');
	// escape quotes
	str = str.replace(/\'/gm, '\\\'');
	// strip html elements
	str = str.replace(/<[^>]*>?/gm, '');
	return str;
}

function slug(str) {
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
		var dedup = {}
		Object.keys(translations).filter(key => !startsWithNumber(key)).forEach(key => dedup[slug(key.toLowerCase())] = translations[key]);
		Object.keys(dedup).forEach(key => {
			xml += '  <string name="'+key+'">'+str2xml(dedup[key])+'</string>\n';
		})
		xml += '</resources>';
		fs.writeFileSync(path.join(process.cwd(), 'build', langFolder, 'strings.xml'), xml);
	}
})