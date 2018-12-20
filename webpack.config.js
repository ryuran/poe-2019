const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new HtmlWebpackPlugin({
      filename: 'partial.html',
      template: './src/partial.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'second.html',
      template: './src/second.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  }
}
