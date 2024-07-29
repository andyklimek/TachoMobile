module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
  },
  env: {
    'react-native/react-native': true,
  },
  plugins: ['react', 'react-native'],
  rules: {
    'no-console': 'error',
    'no-unused-vars': 'error',
  },
};
