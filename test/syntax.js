const test = require('tape');
const fs = require('fs');

const FILE_REGEX = '[a-z][a-z]-[A-Z][A-Z].json';

test('check syntax', (t) => {
	fs.readdirSync('.')
		.filter((x) => x.match(FILE_REGEX))
		.forEach((lang) => {
			test(`check ${lang} syntax`, (t) => {
				t.doesNotThrow(() => require(`../${lang}`));
				t.end();
			});
		});
	t.end();
});