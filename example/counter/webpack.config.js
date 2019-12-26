const Path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./main.ts",
  output: {
    path: Path.resolve("./dist"),
    filename: "[name].[hash].js",
    globalObject: "this"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  devServer: {
    contentBase: "./dist",
    host: "0.0.0.0",
    inline: true,
    compress: true,
    port: 9999
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "awesome-typescript-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: Path.resolve("./index.html")
    })
  ]
};
