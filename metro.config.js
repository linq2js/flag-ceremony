const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Path to local storion package
const storionPath = path.resolve(__dirname, "../storion/packages/storion");

// Watch the storion package for changes
config.watchFolders = [storionPath];

// Resolve storion from the local path
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(storionPath, "node_modules"),
];

// Map storion imports to local package
config.resolver.extraNodeModules = {
  storion: storionPath,
};

// Ensure symlinks are followed
config.resolver.unstable_enableSymlinks = true;

module.exports = withNativeWind(config, { input: "./global.css" });
