const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
  if (env.hasOwnProperty('production') && env.production) {
    env.NODE_ENV = 'production';
  } else {
    env.NODE_ENV = 'development';
  }

  console.log('Using', env.NODE_ENV, 'settings.');

  return {
    mode: env.NODE_ENV,
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
