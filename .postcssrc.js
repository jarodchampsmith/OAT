const pkg = require('./package.json');
const postcssAtRulesVariables = require('postcss-at-rules-variables');
const postcssConditionals = require('postcss-conditionals');
const postcssCssNext = require('postcss-cssnext');
const postcssEach = require('postcss-each');
const postcssEasings = require('postcss-easings');
const postcssFor = require('postcss-for');
const postcssImport = require('postcss-import');
const postcssMixins = require('postcss-mixins');
const postcssOmitImportTilde = require('postcss-omit-import-tilde');
const postcssSingleCharset = require('postcss-single-charset');
const postcssUrl = require('postcss-url');

module.exports = {
	'plugins': [
		postcssOmitImportTilde(),
		postcssImport({
			addModulesDirectories: pkg.cssImportSource
		}),
		postcssAtRulesVariables(),
		postcssMixins(),
		postcssConditionals(),
		postcssEach(),
		postcssFor(),
		postcssEasings(),
		postcssCssNext(),
		postcssUrl(),
		postcssSingleCharset()
	]
};
