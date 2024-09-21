module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: ['react-native-reanimated/plugin',],
      plugins: ['react-native-paper/babel'],
      env: { 
        production: {
          plugins: ['react-native-paper/babel'],
        },
      },
    };
  };
  