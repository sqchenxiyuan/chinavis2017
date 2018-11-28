const webpackBaseConfig = require("./webpack.config.base.js")
const webpack = require("webpack")
const merge = require("webpack-merge")

module.exports = merge(webpackBaseConfig, {
    mode: "development",
    devtool: "eval-source-map",
    output: {
        filename: "[name].js",
        chunkFilename: "[name].chunk.js",
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: "/public/index.html" },
            ],
        },
        stats: "normal",
        host: "0.0.0.0",
        port: 8080,
        hot: true
    }
})