// No automatic generation: we don't want to depend on fs, as we want to keep this universal
// ls *-*.json | while read line; do printf "\"`printf $line | cut -d '.' -f1`\",\n"; done

var languages = [
	"ar-AR",
	"bg-BG",
	"ca-CA",
	"cs-CZ",
	"da-DK",
	"de-DE",
	"el-GR",
	"en-US",
	"eo-EO",
	"es-ES",
	"eu-ES",
	"fa-IR",
	"fi-FI",
	"fr-FR",
	"he-IL",
	"hi-IN",
	"hr-HR",
	"hu-HU",
	"id-ID",
	"it-IT",
	"ko-KR",
	"mk-MK",
	"my-BM",
	"nb-NO",
	"ne-NP",
	"nl-NL",
	"nn-NO",
	"pl-PL",
	"pt-BR",
	"pt-PT",
	"ro-RO",
	"ru-RU",
	"sl-SL",
	"sr-RS",
	"sv-SE",
	"te-IN",
	"tr-TR",
	"uk-UA",
	"vi-VN",
	"zh-CN",
	"zh-HK",
	"zh-TW"
];

module.exports = function () {
	var jsonExports = {};
	languages.forEach(function (language) {
		jsonExports[language] = require("./".concat(language, ".json"));
	});
	return jsonExports;
};

module.exports.all = languages;
