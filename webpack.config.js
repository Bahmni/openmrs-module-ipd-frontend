const path = require("path");
const cssExtract = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    library: "BahmniNextUI",
    libraryTarget: "umd",
    umdNamedDefine: true,
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
  externals: {
    react: "react", // Exclude react from the bundled output
    "react-dom": "react-dom", // Exclude react-dom from the bundled output
  },
};
