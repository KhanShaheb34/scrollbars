/* eslint no-var: 0, no-unused-vars: 0 */
var path = require("path");
var runCoverage = process.env.COVERAGE === "true";
var isCI = process.env.CI === "true";

var coverageLoaders = [];
var coverageReporters = [];

if (runCoverage) {
  // coverageLoaders.push({
  //   test: /\.js$/,
  //   include: path.resolve("src/"),
  //   loader: "isparta-loader",
  // });
  // coverageReporters.push("coverage");
}

module.exports = function karmaConfig(config) {
  config.set({
    browsers: isCI ? ["ChromeHeadlessCI"] : ["Chrome"],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--disable-gpu"],
      },
    },
    singleRun: true,
    frameworks: ["mocha", "webpack"],
    files: ["./test.js"],
    preprocessors: {
      "./test.js": ["webpack", "sourcemap"],
    },
    reporters: ["mocha"].concat(coverageReporters),
    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      resolve: {
        alias: {
          "react-custom-scrollbars": path.resolve(__dirname, "./src"),
        },
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            loader: "babel-loader",
            exclude: /node_modules/,
          },
        ].concat(coverageLoaders),
      },
      plugins: [
        new (require("webpack").DefinePlugin)({
          "process.env": JSON.stringify({}),
        }),
      ],
    },
    coverageReporter: {
      dir: "coverage/",
      reporters: [
        { type: "html", subdir: "report-html" },
        { type: "text", subdir: ".", file: "text.txt" },
        { type: "text-summary", subdir: ".", file: "text-summary.txt" },
      ],
    },
  });
};
