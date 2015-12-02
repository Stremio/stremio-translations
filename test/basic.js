var tape = require("tape");
var fs = require("fs");

fs.readdirSync(".").filter(function(x){ return x.match(".json$") && x.match("-") }).forEach(function(lang) {
	tape(lang, function(t) {
		try { require("../"+lang); t.ok(true, "parses properly"); } catch(e) { t.error(e) };
		t.end();
	})
});
