module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    jest: true
  },
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'semi': 2,
    'no-trailing-spaces': 0,
    'padded-blocks': 0,
    'no-unused-vars': 0,
    'no-unused-expressions': 0,
    'space-before-function-paren': 0,
    'brace-style': 0,
    'prefer-destructuring': 0,
    'prefer-template': 0,
    'no-console': 0,
    'implicit-arrow-linebreak': 0,
    'nonblock-statement-body-position': ['error', 'below'] ,
    'curly': 0,
    'no-param-reassign': 0,
    'operator-linebreak': ['error', 'after'],
    'class-methods-use-this': 0,
    'no-underscore-dangle': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'no-bitwise': 0,
    'guard-for-in': 0,
    'no-restricted-syntax': 0,
    'no-return-assign': 0,
    'no-else-return': 0,
    'import/no-named-as-default': 0,
    'consistent-return': 0,
    'arrow-body-style': 0,
    'no-plusplus': 0,
    'lines-between-class-members': 0,
    'eqeqeq': 0,
    'no-loop-func': 0,
  },
  extends: 'airbnb',
  globals: {
    "jest": true,
    "expect": true,
    "mockFn": true,
    "config": true,
    "afterEach": true,
    "beforeEach": true,
    "describe": true,
    "it": true,
    "runs": true,
    "waitsFor": true,
    "pit": true,
    "require": true,
    "xdescribe": true,
    "xit": true
  }
};
