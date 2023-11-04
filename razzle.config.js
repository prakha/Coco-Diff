const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
module.exports = {
  options: {
    buildType: 'spa',

    verbose: true,
    staticCssInDev: true,
    cssPrefix: "static/css",
    enableReactRefresh: true,
    jsPrefix: "static/js",
    mediaPrefix: "static/media",
    browserslist: undefined, // or what your apps package.json says
  },
  plugins: ["workbox", "eslint"],
  modifyWebpackConfig: ({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    webpackConfig, // the created webpack config
    webpackObject, // the imported webpack node module
    options: {
      pluginOptions,
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the modified options that will be used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) => {
    console.log(pluginOptions)
    // webpackConfig.output.publicPath = "http://192.168.2.100:3001";
    if (target === "node") {

    } else {
      webpackConfig.entry["examclient"] = path.resolve(__dirname + "/src/examclient.js")
      webpackConfig.entry["extraclient"] = path.resolve(__dirname + "/src/extraclient.js")
      
      // webpackConfig.plugins = webpackConfig.plugins.filter((p) => {
      //   return !p instanceof HtmlWebpackPlugin
      // })
      
      webpackConfig.plugins.push(new HtmlWebpackPlugin({
        template: path.join(__dirname, "public", "index.html"),
        inject: 'body',
        excludeChunks:['examclient','extraclient'],
        // chunks: ['client'],
        filename: 'index.html',
        inject:false,
      }))

      webpackConfig.plugins.push(new HtmlWebpackPlugin({
        template: path.join(__dirname, "public", "alt.html"),
        inject: 'body',
        chunks: ['examclient'],
        inject:false,
        filename: 'exam.html'
      }))

      webpackConfig.plugins.push(new HtmlWebpackPlugin({
        template: path.join(__dirname, "public", "alt.html"),
        inject: 'body',
        chunks: ['extraclient'],
        inject:false,
        filename: 'extra.html'
      }))

    }
    console.log(webpackConfig.plugins)
    // console.log("{webpackpaths}", webpackConfig.entry)

    return webpackConfig;
  },
};
