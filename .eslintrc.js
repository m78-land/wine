module.exports = {
  extends: [require.resolve('@lxjx/preset-config/.eslintrc.js')],

  globals: {},

  rules: {
    'no-restricted-syntax': 'off',
    'prefer-promise-reject-errors': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'no-await-in-loop': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-implied-eval': 'off',
    'no-alert': 'off',
    'no-restricted-globals': 'off',
    'react/no-unescaped-entities': 'off',
    'prefer-destructuring': 'off',
    'react/button-has-type': 'off',
    'no-void': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'jsx-a11y/tabindex-no-positive': 'off'
  },
};
