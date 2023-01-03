const path = require('path');

module.exports = {
  mode: 'development',
  entry: './example/index.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devServer: {
    port: 1996,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
  }
};