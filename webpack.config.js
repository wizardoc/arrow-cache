const Path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.ts",
  output: {
    path: Path.resolve("./dist"),
    filename: "main.js",
    globalObject: "this",
    library: "ArrowCache",
    libraryTarget: "umd"
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
        test: /\.worker\.ts$/,
        use: [
          {
            loader: "worker-loader",
            options: {
              name: "[name]:[hash].js",
              inline: true
            }
          },
          {
            loader: "awesome-typescript-loader"
          }
        ]
      },
      {
        test: /\.ts$/,
        use: "awesome-typescript-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: Path.resolve("./public/index.html")
    })
  ]
};
