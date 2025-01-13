import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import tsEslint from 'typescript-eslint'
import globals from 'globals'

// prettier-ignore
const ignores = [
	'**/.DS_Store',
	'*.d.ts',
	'.idea',
	'.vscode',
	'*.suo',
	'*.ntvs*',
	'*.njsproj',
	'*.sln',
	'*.sw?',

	'.env.local',
	'.env.*.local',

	'**/android/',
	'**/dist/',
	'**/ios/',
	'**/node_modules/',
	'**/public/',
	'**/resources/',
	'**/coverage/',

	'npm-debug.log*',
	'yarn-debug.log*',
	'yarn-error.log*',
	'pnpm-debug.log*',
]

export default tsEslint.config(
	{ ignores },
	{
		extends: [eslint.configs.recommended, ...tsEslint.configs.recommended, ...vue.configs['flat/recommended']],
		files: ['**/*.{js,ts,vue}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: globals.browser,
			parserOptions: {
				parser: tsEslint.parser
			}
		},
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/no-deprecated-slot-attribute': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
					ignoreRestSiblings: true
				}
			]
		}
	},
	eslintConfigPrettier
)
