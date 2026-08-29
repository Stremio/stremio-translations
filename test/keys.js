const test = require('tape');
const fs = require('fs');

const ENGLISH_FILE = '../en-US.json';
const FILE_REGEX = '[a-z][a-z]-[A-Z][A-Z].json';

const englishFile = require(ENGLISH_FILE);
const englishFileKeys = Object.keys(englishFile);

test('check missing keys', (t) => {
    fs.readdirSync('.')
        .filter((x) => x.match(FILE_REGEX))
        .forEach((lang) => {
            test(`check ${lang} keys`, (t) => {
                const file = require(`../${lang}`);
                const fileKeys = Object.keys(file);

                for (let i = 0; i < fileKeys.length; i++) {
                    if (englishFileKeys[i] !== fileKeys[i]) {
                        t.fail(`key"${fileKeys[i]}" doesn't match key "${englishFileKeys[i]}" of en-US.json`);
                        t.end();
                        return; 
                    }
                }

                t.pass('all keys match');
                t.end();
            });
        });
    t.end();
});