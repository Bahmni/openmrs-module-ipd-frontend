const path = require("path");
const cssExtract = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const packageJson = require("./package.json");
const dependencies = packageJson.dependencies;

const commonConfig = {
  entry: {
    index: "./src/index.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true,
  },
  plugins: [
    new cssExtract({
      filename: "styles.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: [cssExtract.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [cssExtract.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};

const federationConfig = {
  ...commonConfig,
  name: "federation",
  resolve: {
    ...commonConfig.resolve,
    alias: {
      react: path.resolve(__dirname, "./__mocks__/windowReact.js"),
      "react-dom": path.resolve(__dirname, "./__mocks__/windowReactDom.js"),
    },
  },
  output: {
    ...commonConfig.output,
    path: path.resolve(commonConfig.output.path, "federation"),
  },
  // devServer: {},
  plugins: [
    ...commonConfig.plugins,
    new ModuleFederationPlugin({
      name: "bahmni_ipd",
      filename: "remoteEntry.js",
      exposes: {
        "./Dashboard": "./src/Dashboard.jsx",
      },
      shared: {
        // ...dependencies,
        "carbon-components": {
          singleton: true,
          requiredVersion: dependencies["carbon-components"],
        },
        "carbon-components-react": {
          singleton: true,
          requiredVersion: dependencies["carbon-components-react"],
        },
        "bahmni-carbon-ui": {
          singleton: true,
          requiredVersion: dependencies["bahmni-carbon-ui"],
        },
        react: {
          singleton: true,
          eager: true,
          requiredVersion: dependencies.react,
        },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: dependencies["react-dom"],
        },
      },
    }),
  ],
  externals: {
    react: "React", // Exclude react from the bundled output
    "react-dom": "ReactDOM", // Exclude react-dom from the bundled output
  },
};

const sandboxConfig = {
  ...commonConfig,
  name: "sandbox",
  output: {
    ...commonConfig.output,
    path: path.resolve(commonConfig.output.path, "sandbox"),
  },
  devServer: {},
  plugins: [
    ...commonConfig.plugins,
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};

module.exports = [federationConfig, sandboxConfig];
