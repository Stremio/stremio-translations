#!/usr/bin/env node

var path = require("path");

var en = require("../en-US");

var p = path.resolve(process.cwd(), process.argv[2]);
console.log("adding missing props to "+p);
var other = require(p);

var rewritten = { };

var missing=0;
Object.keys(en).forEach(function(key) {
	if (!other.hasOwnProperty(key)) missing++;
	rewritten[key] = other[key] || en[key];
});

console.log(missing+" missing properties");
console.log("re-writing to "+p);

if (!missing) return console.log("no missing properties, exiting");

fs.saveFile(p, JSON.stringify(rewritten,null,4), function(err) {
	console.log(err || "successfully re-written file");
	process.exit(err ? 1 : 0);
})
