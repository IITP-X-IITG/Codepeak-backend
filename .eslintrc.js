module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	env: {
		es6: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	parserOptions: {
		sourceType: 'module',
		project: ['./tsconfig.json'],
		allowAutomaticSingleRunInference: false,
		tsconfigRootDir: __dirname,
	},
	rules: {},
}
