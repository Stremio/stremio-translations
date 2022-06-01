#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var files = fs.readdirSync(process.cwd());

fs.mkdirSync(path.join(process.cwd(), 'build'), { recursive: true });

files.forEach(function(file) {
	if (/[a-z][a-z]-[A-Z][A-Z]\.json$/g.test(file)) {
		var lang = file.replace('.json', '');
		var translations = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)))
		fs.mkdirSync(path.join(process.cwd(), 'build', 'values-' + lang), { recursive: true });
		let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
		xml += '<resources>\n';
		Object.keys(translations).forEach(key => {
			xml += '  <string name="'+key.toLowerCase()+'">'+translations[key].replace(/{{[^}]+}}/gm, '%s')+'</string>\n';
		})
		xml += '</resources>';
		fs.writeFileSync(path.join(process.cwd(), 'build', 'values-' + lang, 'strings.xml'), xml);
	}
})