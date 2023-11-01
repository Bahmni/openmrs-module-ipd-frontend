const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public" }],
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
        test: /\.json$/,
        use: "json-loader",
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
        exclude: /\.module\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /\.module\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.module\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { modules: true } },
        ],
      },
      {
        test: /\.module\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { modules: true } },
          "sass-loader",
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true,
            },
          },
        ],
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
    // NOTE: VERY IMPORTANT
    // match this to the proxy setting. This sets up the base path for this micro-frontend
    // This is mapped to BASE_URL in constants.js for convenience
    publicPath: "/ipd/",
  },
  // devServer: {},
  plugins: [
    ...commonConfig.plugins,
    new ModuleFederationPlugin({
      name: "bahmni_ipd",
      filename: "remoteEntry.js",
      exposes: {
        "./Dashboard": "./src/entries/Dashboard.jsx",
        "./DrugChartModal": "./src/entries/DrugChartModal/DrugChartModal.jsx",
        "./DrugChartModalNotification":
          "./src/entries/DrugChartModal/DrugChartModalNotification.jsx",
        "./IpdDashboard": "./src/components/Dashboard/Dashboard.jsx",
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
  devServer: {
  },
  plugins: [
    ...commonConfig.plugins,
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};

module.exports = [federationConfig, sandboxConfig];
