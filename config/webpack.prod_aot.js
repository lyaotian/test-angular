let webpack = require('webpack');
let webpackMerge = require('webpack-merge');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let commonConfig = require('./webpack.common.js');
let helpers = require('./helpers');
let CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.aot.ts'
  },

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      output: {comments: false},
      mangle: {
        keep_fnames: true
      }
    }),
    new ExtractTextPlugin('style.[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets/', to: 'assets/' },
      // { from: 'favicon.ico' }
    ], {
        ignore: [
          // 'image/*',
          { glob: '**/.*', dot: true }
        ],
      }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    })
  ]
});