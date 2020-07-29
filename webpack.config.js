const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
  console.log('ENV:', typeof(env));
  let mode = 'development';

  if (env && env.hasOwnProperty('NODE_ENV') && env.NODE_ENV === 'production') {
    mode = 'production';
  }

  console.log('Using', mode, 'settings.');

  return {
    mode: mode,
    entry: './src/index.js',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Sounds of Sea Ice',
        template: path.resolve(__dirname, 'src', 'index.ejs'),
      }),
    ],
  };
};
