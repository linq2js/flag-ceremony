const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");
const fs = require("fs");

const config = getDefaultConfig(__dirname);

// Path to local storion package
const storionPath = path.resolve(__dirname, "../storion/packages/storion");
const storionExists = fs.existsSync(storionPath);

// Only configure local storion if it exists (for local development)
if (storionExists) {
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
}
// If storion doesn't exist locally, it will be resolved from node_modules
// (from npm package or file: dependency that was installed)

module.exports = withNativeWind(config, { input: "./global.css" });
