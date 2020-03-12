const Path = require("path");

module.exports = {
  entry: "./src/main.ts",
  mode: "production",
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
  }
};
