"use strict";

const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: "./src/index.js",
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isProduction ? "scrollbars.min.js" : "scrollbars.js",
    library: "ReactCustomScrollbars",
    libraryTarget: "umd",
    globalObject: "this",
  },
  optimization: {
    minimize: isProduction,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  resolve: {
    extensions: [".js"],
  },
};
