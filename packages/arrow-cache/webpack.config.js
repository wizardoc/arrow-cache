const Path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  entry: "./src/client/main.ts",
  output: {
    path: Path.join(__dirname, "./dist"),
    filename: "main.js",
    globalObject: "this",
    library: "ArrowCache",
    publicPath: "",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new CompressionPlugin({
      filename: "[path].br[query]",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    })
  ],
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
