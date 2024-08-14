module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['module:metro-react-native-babel-preset'],
    },
  },
  env: {
    'react-native/react-native': true,
    browser: true,
    node: true,
  },
  plugins: ['react', 'react-native'],
  rules: {
    'no-console': 'error',
    'no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'react-native/no-inline-styles': 'off',
    'no-control-regex': 'off',
    'no-bitwise': 'off',
  },
};
