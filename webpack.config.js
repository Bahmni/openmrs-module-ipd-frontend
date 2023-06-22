const path = require("path");
const cssExtract = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const packageJson = require("./package.json");
const dependencies = packageJson.dependencies;

module.exports = {
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    // library: "BahmniNextUI",
    // libraryTarget: "umd",
    // umdNamedDefine: true,
    filename: "[name].[contenthash].js",
    clean: true,
  },
  devServer: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new cssExtract({
      filename: "styles.css",
    }),
    new ModuleFederationPlugin({
      name: "bahmni_ipd",
      filename: "remoteEntry.js",
      exposes: {
        "./Dashboard": "./src/Dashboard.jsx",
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          requiredVersion: dependencies.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
      },
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
