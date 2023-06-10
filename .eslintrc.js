module.exports = {
	root: true,
	plugins: [
		'@typescript-eslint',
		'@typescript-eslint/internal',
		'deprecation',
		'eslint-comments',
		'eslint-plugin',
		'import',
		'jest',
		'simple-import-sort',
		'unicorn',
	],
	env: {
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:eslint-plugin/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
	],
	parserOptions: {
		sourceType: 'module',
		project: [
			'./tsconfig.json'
		],
		allowAutomaticSingleRunInference: true,
		tsconfigRootDir: __dirname,
		warnOnUnsupportedTypeScriptVersion: false,
		EXPERIMENTAL_useSourceOfProjectReferenceRedirect: false,
		cacheLifetime: {
			// we pretty well never create/change tsconfig structure - so need to ever evict the cache
			// in the rare case that we do - just need to manually restart their IDE.
			glob: 'Infinity',
		},
	},
	rules: {
		// make sure we're not leveraging any deprecated APIs
		'deprecation/deprecation': 'error',

		//
		// our plugin :D
		//

		'@typescript-eslint/ban-ts-comment': [
			'error',
			{
				'ts-expect-error': 'allow-with-description',
				'ts-ignore': true,
				'ts-nocheck': true,
				'ts-check': false,
				minimumDescriptionLength: 5,
			},
		],
		'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{ prefer: 'type-imports', disallowTypeAnnotations: true },
		],
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/prefer-for-of': 'error',
		'@typescript-eslint/prefer-nullish-coalescing': 'error',
		'@typescript-eslint/prefer-optional-chain': 'error',
		'@typescript-eslint/unbound-method': 'off',
		'@typescript-eslint/prefer-as-const': 'error',
		'@typescript-eslint/restrict-template-expressions': [
			'error',
			{
				allowNumber: true,
				allowBoolean: true,
				allowAny: true,
				allowNullish: true,
				allowRegExp: true,
			},
		],
		'@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],

		//
		// Internal repo rules
		//

		'@typescript-eslint/internal/no-poorly-typed-ts-props': 'error',
		'@typescript-eslint/internal/no-typescript-default-import': 'error',
		'@typescript-eslint/internal/prefer-ast-types-enum': 'error',

		//
		// eslint-base
		//

		curly: ['error', 'all'],
		eqeqeq: [
			'error',
			'always',
			{
				null: 'never',
			},
		],
		'no-mixed-operators': 'error',
		'no-console': 'error',
		'no-process-exit': 'error',
		'no-fallthrough': ['warn', { commentPattern: '.*intentional fallthrough.*' }],

		//
		// eslint-plugin-eslint-comment
		//

		// require a eslint-enable comment for every eslint-disable comment
		'eslint-comments/disable-enable-pair': [
			'error',
			{
				allowWholeFile: true,
			},
		],
		// disallow a eslint-enable comment for multiple eslint-disable comments
		'eslint-comments/no-aggregating-enable': 'error',
		// disallow duplicate eslint-disable comments
		'eslint-comments/no-duplicate-disable': 'error',
		// disallow eslint-disable comments without rule names
		'eslint-comments/no-unlimited-disable': 'error',
		// disallow unused eslint-disable comments
		'eslint-comments/no-unused-disable': 'error',
		// disallow unused eslint-enable comments
		'eslint-comments/no-unused-enable': 'error',
		// disallow ESLint directive-comments
		'eslint-comments/no-use': [
			'error',
			{
				allow: ['eslint-disable', 'eslint-disable-line', 'eslint-disable-next-line', 'eslint-enable'],
			},
		],

		//
		// eslint-plugin-import
		//

		// disallow non-import statements appearing before import statements
		'import/first': 'error',
		// Require a newline after the last import/require in a group
		'import/newline-after-import': 'error',
		// Forbid import of modules using absolute paths
		'import/no-absolute-path': 'error',
		// disallow AMD require/define
		'import/no-amd': 'error',
		// forbid default exports - we want to standardize on named exports so that imported names are consistent
		'import/no-default-export': 'error',
		// disallow imports from duplicate paths
		'import/no-duplicates': 'error',
		// Forbid the use of extraneous packages
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: true,
				peerDependencies: true,
				optionalDependencies: false,
			},
		],
		// Forbid mutable exports
		'import/no-mutable-exports': 'error',
		// Prevent importing the default as if it were named
		'import/no-named-default': 'error',
		// Prohibit named exports
		'import/no-named-export': 'off', // we want everything to be a named export
		// Forbid a module from importing itself
		'import/no-self-import': 'error',
		// Require modules with a single export to use a default export
		'import/prefer-default-export': 'off', // we want everything to be named

		// enforce a sort order across the codebase
		'simple-import-sort/imports': 'error',

		'one-var': ['error', 'never'],

		'unicorn/no-typeof-undefined': 'error',
	},
	overrides: [
		// all test files
		
		// test utility scripts and website js files
		
		// plugin source files
		
		// plugin rule source files
		
		// plugin rule tests
		
		// files which list all the things
		
		// tools and tests
		
		// generated files
		
		// ast spec specific standardization
		
	],
}
