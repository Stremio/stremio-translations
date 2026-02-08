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

const filter = (translations) => {
	const excludeSlugs = ["label_website_", "label_faq_"];
	const includeSlugs = ["label_website_freedom_to_stream", "label_website_slogan_all"];

	return Object.fromEntries(
		Object.entries(translations)
			.filter(([key]) => (
				!excludeSlugs.some((slug) => key.startsWith(slug)) ||
					includeSlugs.some((slug) => key.startsWith(slug))
			))
	);
};

module.exports = {
	slug,
	deduplicate,
	filter,
};
