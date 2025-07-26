const AMPERSAND_HTML_ENTITY = "\\&(?![#\\w]+;)";
const ELLIPSIS_HTML_ENTITY = "\\.\\.\\.";
const NBSP_TO_SPACE = "\\&nbsp\\;";
const RIGHT_DOUBLE_ANGLE_QUOTE = "\\&raquo\\;";
const ESCAPED_SINGLE_QUOTE = "\\'";
const ESCAPED_PERCENTAGE_SIGN = "\\%(?!s|\\d*d|[\\.\\d]*f)";
const ESCAPED_QUESTION_MARK = "\\?";
const HTML_ELEMENT_REGEX = "<[^>]*>?";
const TEXT_VARS_REGEXES = ["{{[^}]+}}", "\\$ ?{[\\d]+}", "\\#{[^}]+}"];
const NEW_LINES_REGEXES = ["<\\/?br ?\\/?>"];

/**
 * replace "&" with html entity
 */
function replaceAmpershandHtmlEntity(str) {
  return str.replace(new RegExp(AMPERSAND_HTML_ENTITY, "gm"), "&amp;");
}

/**
 * replace "..." with html entity
 */
function replaceElipsisHtmlEntity(str) {
  return str.replace(new RegExp(ELLIPSIS_HTML_ENTITY, "gm"), "&#8230;");
}

/**
 * replace "&nbsp;" with space
 */
function replaceNbspToSpace(str) {
  return str.replace(new RegExp(NBSP_TO_SPACE, "gm"), " ");
}

/**
 * replace "&raquo;" with »
 */
function replaceRightDoubleAngleQuote(str) {
  return str.replace(new RegExp(RIGHT_DOUBLE_ANGLE_QUOTE, "gm"), "»");
}

/**
 * escape quotes
 */
function escapeSingleQuote(str) {
  return str.replace(new RegExp(ESCAPED_SINGLE_QUOTE, "gm"), "\\'");
}

/**
 * escape percentage sign
 */
function escapePercentageSign(str) {
  return str.replace(new RegExp(ESCAPED_PERCENTAGE_SIGN, "gm"), "%%");
}

/**
 * escape question marks
 */
function escapeQuestionMark(str) {
  return str.replace(new RegExp(ESCAPED_QUESTION_MARK, "gm"), "\\?");
}

/**
 * strip html elements
 */
function stripHtmlElements(str) {
  return str.replace(new RegExp(HTML_ELEMENT_REGEX, "gm"), "");
}

/**
 * replace ${1}, ${2}, etc. with %s
 */
function replaceTextVariables(str) {
  TEXT_VARS_REGEXES.forEach((regex) => {
    str = str.replace(new RegExp(regex, "gm"), "%s");
  });

  return str;
}

/**
 * replace <br> with \n
 */
function replaceBr(str) {
  NEW_LINES_REGEXES.forEach((regex) => {
    str = str.replace(new RegExp(regex, "gm"), "\n");
  });

  return str;
}

module.exports = {
  replaceAmpershandHtmlEntity,
  replaceElipsisHtmlEntity,
  replaceNbspToSpace,
  replaceRightDoubleAngleQuote,
  escapeSingleQuote,
  escapePercentageSign,
  escapeQuestionMark,
  stripHtmlElements,
  replaceTextVariables,
  replaceBr,
};
