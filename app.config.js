const myValue = "civilers";

module.exports = {
  name: myValue,
  //version: process.env.MY_CUSTOM_PROJECT_VERSION || '1.0.0',
  // All values in extra will be passed to your app.
  extra: {
    fact: "kittens are cool",
  },
  plugins: [
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
      },
    ],
  ],
  packagerOpts: {
    sourceExts: ["cjs"],
  },
};
