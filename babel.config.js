module.exports = function (api) {
  api.cache(true);
  console.log('🔧 Babel config loaded - NativeWind plugin should be active');
  
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }]
    ],
    plugins: [
      'react-native-reanimated/plugin'
    ],
  };
};