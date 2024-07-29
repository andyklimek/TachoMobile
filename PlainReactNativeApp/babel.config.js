module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'], // Base root directory
        alias: {
          '@': './', // Map '@' to the root directory
        },
      },
    ],
    [
      '@babel/plugin-transform-class-properties',
      {
        loose: true, // Ensure consistency
      },
    ],
    [
      '@babel/plugin-transform-private-methods',
      {
        loose: true, // Ensure consistency
      },
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      {
        loose: true, // Ensure consistency
      },
    ],
    'nativewind/babel',
  ],
};
