// eslint.config.js
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
	{ ignores: ['*.d.ts', '**/coverage', '**/dist'] },
	{
		extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...vue.configs['flat/recommended']],
		files: ['**/*.{js,ts,vue}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: globals.browser,
			parserOptions: {
				parser: tseslint.parser
			}
		},
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/no-deprecated-slot-attribute': 'off'
		}
	},
	eslintConfigPrettier
)
