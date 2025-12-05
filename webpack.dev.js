const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    hot: true, // Enable hot reloading
    liveReload: true,
    static: "./dist",
    open: {
      app: {
        name: "google-chrome-stable",
      },
    },
  },

  watchOptions: {
    poll: 1000, // Check for changes every second
  },
});
