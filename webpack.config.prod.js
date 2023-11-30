const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const srcDir = path.resolve(__dirname, 'client/src')

module.exports = {
  entry: `${srcDir}/index.js`,
  output: {
    path: path.resolve(__dirname, 'client/public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              localIdentName: '[name]__[local]__[hash:base64:6]'
            }
          },
          'stylus-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'client/src/index.html' }),
    new webpack.DefinePlugin({
      'process.env.HOST': JSON.stringify(process.env.HOST || 'http://localhost:3000/')
    })
  ]
}
