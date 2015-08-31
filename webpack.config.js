var path = require("path"),
    webpack = require("webpack"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"),
    Uglify = require("webpack/lib/optimize/UglifyJsPlugin"),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/js/components/App.jsx"
    },
    resolve: {
        root: path.resolve(__dirname + "/src"),
        extensions: ["", ".js", ".jsx"]
    },
    output: {
        path: __dirname + "/build",
        filename: "js/[name].js",
        hash: true
    },
    module: {
        loaders: [{
            test: /\.jsx$|\.js$/,
            exclude: /node_modules|server.js|\.json$/,
            loader: "babel-loader"
        }, {
            test: /\.css$/,
            root: path.resolve(__dirname + "/src/styles"),
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }]
    },
    plugins:[
        new HtmlWebpackPlugin({ template: "./src/index.html"}),
        new Uglify(),
        new ExtractTextPlugin("[name].css")
    ]
};