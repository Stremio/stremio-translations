const slug = str => {
	// can't start with number
	if (/^\d/.test(str)) return false;
	// can't include colons
	if (/\:/.test(str)) return false;
	str = str.replace(/[ &-]+/g, '_')
	str = str.replace(/__+/g, '_');
	return `label_${str}`;
}

const deduplicate = (translations) => {
  const dedup = {};
  Object.keys(translations).filter(key => slug(key)).forEach(key => dedup[slug(key.toLowerCase())] = translations[key]);
  return dedup;
}

module.exports = { slug, deduplicate };
