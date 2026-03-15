/* oxlint-disable unicorn/prefer-module */
// oxlint-disable-next-line unicorn/no-anonymous-default-export
module.exports = (api) => {
  api.cache(true);
  return {
    plugins: [
      // react-native-worklets/plugin must be listed last
      "react-native-worklets/plugin",
    ],
    presets: ["babel-preset-expo"],
  };
};
