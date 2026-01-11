const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Ensure we extend the default config correctly
module.exports = withNativeWind(config, {
  input: "./global.css",
  projectRoot,
  inlineRem: false,
});
