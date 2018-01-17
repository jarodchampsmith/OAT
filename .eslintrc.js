module.exports = {
	root: true,
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true
	},
	globals: {
		'cordova': true,
		'DEV': true,
		'PROD': true,
		'__THEME': true
	},
	// https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
	extends: 'standard',
	// required to lint *.vue files
	plugins: [
		'html'
	],
	// add your custom rules here
	'rules': {
		'arrow-parens': 0,
		'semi': ['error', 'always'],
		'indent': ['error', 'tab', { 'SwitchCase': 1 }],
		'no-tabs': 0,
		'quotes': 'warn',
		'no-unused-vars': 'warn',
		'prefer-template': 'warn',
		'no-param-reassign': ['warn', { 'props': false }],
		'one-var': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
	}
};
