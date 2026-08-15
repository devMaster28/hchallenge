module.exports = {
  preset: '@react-native/jest-preset',
  transform: {
    '^.+\\.(js|mjs|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native-documents/picker|lucide-react-native|react-native-svg)/)',
  ],
  setupFiles: [
    './node_modules/@react-native-documents/picker/jest/build/jest/setup.js',
  ],
};
