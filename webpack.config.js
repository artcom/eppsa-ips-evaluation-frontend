/* eslint-disable import/no-commonjs */

const path = require("path")
const webpack = require("webpack")

const publicPath = path.join(__dirname, "public")

module.exports = [
  {
    target: "web",
    entry: {
      setUp: "./src/setUp/main.js"
    }
  }
].map(({ target, entry }) => {
  const es2015 = ["es2015", { modules: false }]

  return {
    target,
    entry,
    output: {
      path: publicPath,
      filename: "[name].js"
    },
    node: {
      fs: "empty"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, "src")],
          use: {
            loader: "babel-loader",
            options: {
              presets: target === "web" ? [es2015] : [],
              plugins: [
                "transform-object-rest-spread",
                "transform-react-jsx"
              ]
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.EnvironmentPlugin(["NODE_ENV"]),
      new webpack.IgnorePlugin(/^(bufferutil|utf-8-validate)$/, /ws\/lib$/),
      new webpack.NormalModuleReplacementPlugin(/any-promise\/register\.js$/, "./register-shim.js")
    ],
    devServer: {
      contentBase: publicPath,
      disableHostCheck: true,
      host: "0.0.0.0"
    }
  }
})
