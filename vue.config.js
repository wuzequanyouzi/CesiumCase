// webpack
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path');
// ===cesium ====
let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'

module.exports = {
  configureWebpack: {
  // provide the app's title in webpack's name field, so that
  // it can be accessed in index.html to inject the correct title.
  // name: name,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    // new CopyWebpackPlugin({ patterns: [{ from: "static", to: "static" }]}),
    new CopyWebpackPlugin({patterns: [{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]}),
    new CopyWebpackPlugin({patterns: [{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]}),
    new CopyWebpackPlugin({patterns: [{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]}),
    new CopyWebpackPlugin({patterns: [{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]}),
    new webpack.DefinePlugin({
      CESIUM_BASE_URL: JSON.stringify('./')
    })
  ]},
}