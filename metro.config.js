const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");
const fs = require("fs");

const config = getDefaultConfig(__dirname);

// Local storion development: use dist/ from monorepo if available
const localStorion = path.resolve(__dirname, "../storion/packages/storion");

if (fs.existsSync(localStorion)) {
  const distPath = path.resolve(localStorion, "dist");

  // Watch dist folder for changes (run `pnpm build:watch` in storion)
  config.watchFolders = [distPath];

  // Resolve storion's dependencies (e.g., immer) from its node_modules
  config.resolver.nodeModulesPaths = [
    path.resolve(__dirname, "node_modules"),
    path.resolve(localStorion, "node_modules"),
  ];

  // Map storion subpaths to dist files
  const storionModules = {
    storion: "storion.js",
    "storion/react": "react/index.js",
    "storion/async": "async/index.js",
    "storion/persist": "persist/index.js",
    "storion/network": "network/index.js",
    "storion/devtools": "devtools/index.js",
    "storion/devtools-panel": "devtools-panel/index.js",
  };

  const defaultResolver = config.resolver.resolveRequest;
  // @ts-ignore - resolveRequest is mutable at runtime despite readonly type
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Resolve storion imports to local dist
    if (storionModules[moduleName]) {
      return {
        filePath: path.resolve(distPath, storionModules[moduleName]),
        type: "sourceFile",
      };
    }
    // Default resolver for everything else
    return defaultResolver
      ? defaultResolver(context, moduleName, platform)
      : context.resolveRequest(context, moduleName, platform);
  };
}
// Otherwise: storion resolves from node_modules (npm package)

// @ts-ignore - Metro config type incompatibility with withNativeWind
module.exports = withNativeWind(config, { input: "./global.css" });
