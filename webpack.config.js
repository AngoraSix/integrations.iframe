const path = require('path');
const fs = require('fs');

const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './src/index.js',
  target: 'node',
  mode,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
  },
  externals: nodeModules,
  module: {
    rules: [
      {
        test: /.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.ya?ml$/,
        use: {
          loader: 'yaml-import-loader',
        },
      },
    ],
  },
  devtool: mode !== 'production' ? 'sourcemap' : 'none',
};
