// No automatic generation: we don't want to depend on fs, as we want to keep this universal
// ls *-*.json | while read line; do printf "\"`printf $line | cut -d '.' -f1`\": require(\"./$line\"),\n"; done
module.exports = function() { 
	return {
		"bg-BG": require("./bg-BG.json"),
		"da-DK": require("./da-DK.json"),
		"en-US": require("./en-US.json"),
		"es-ES": require("./es-ES.json"),
		"fr-FR": require("./fr-FR.json"),
		"he-IL": require("./he-IL.json"),
		"hu-HU": require("./hu-HU.json"),
		"it-IT": require("./it-IT.json"),
		"mk-MK": require("./mk-MK.json"),
		"nb-NO": require("./nb-NO.json"),
		"nl-NL": require("./nl-NL.json"),
		"nn-NO": require("./nn-NO.json"),
		"pt-BR": require("./pt-BR.json"),
		"pt-PT": require("./pt-PT.json"),
		"ru-RU": require("./ru-RU.json"),
		"se-SE": require("./se-SE.json"),
		"sr-RS": require("./sr-RS.json"),
		"tr-TR": require("./tr-TR.json"),
	}
};

// ls *-*.json | while read line; do printf "\"`printf $line | cut -d '.' -f1`\",\n"; done
module.exports.all = [
	"bg-BG",
	"da-DK",
	"en-US",
	"es-ES",
	"fr-FR",
	"he-IL",
	"hu-HU",
	"it-IT",
	"mk-MK",
	"nb-NO",
	"nl-NL",
	"nn-NO",
	"pt-BR",
	"pt-PT",
	"ru-RU",
	"se-SE",
	"sr-RS",
	"tr-TR",
];
