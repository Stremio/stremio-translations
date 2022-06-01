#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var files = fs.readdirSync(process.cwd());

fs.mkdirSync(path.join(process.cwd(), 'build'), { recursive: true });

files.forEach(function(file) {
	if (/[a-z][a-z]-[A-Z][A-Z]\.json$/g.test(file)) {
		var lang = file.split('-')[0];
		var translations = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)))
		fs.mkdirSync(path.join(process.cwd(), 'build', 'values-' + lang), { recursive: true });
		let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
		xml += '<resources xmlns:xliff="urn:oasis:names:tc:xliff:document:1.2">\n';
		Object.keys(translations).forEach(key => {
			xml += '  <string name="'+key.toLowerCase()+'">'+translations[key]+'</string>\n';
		})
		xml += '</resources>';
		fs.writeFileSync(path.join(process.cwd(), 'build', 'values-' + lang, 'strings.xml'), xml);
	}
})