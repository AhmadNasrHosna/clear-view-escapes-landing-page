const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const fse = require('fs-extra');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const postCSSPlugins = [
  require('postcss-import'),
  require('postcss-mixins'),
  require('postcss-conditionals'),
  require('postcss-simple-vars'),
  require('postcss-nested'),
  require('postcss-extend'),
  require('postcss-logical')(),
  require('postcss-color-mod-function'),
  require('postcss-preset-env'),
  require('postcss-rem')({
    baseline: 10, // Default to 16
    precision: 3 // Default to 5
  })
];

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap('Copy Images', () => {
      fse.copySync('./app/assets/images', './dist/assets/images')
    })
  }
}

let cssConfig = {
  test: /\.css$/i,
  use: [
    'css-loader', //2. Turns css into common js
    {
      loader: 'postcss-loader', //1. Turns postCSS into regular css
      options: {
        parser: require('postcss-comment'),
        plugins: postCSSPlugins
      }
    }
  ]
}

let pages = fse.readdirSync('./app')
  .filter(file => file.endsWith('.html'))
  .map(page => {
    return new HtmlWebpackPlugin({ // grabs html file
      filename: page, // name of the file
      template: `./app/${page}`, // grabs from
      minify: { // minifies it
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true
      }
    })
  });

// SHARED: =======================

let config = {
  entry: './app/assets/scripts/App.js',
  module: {
    rules: [
      cssConfig
    ]
  },
  plugins: []
}

// DEVELOPMENT Configuration: =======================

if (currentTask == "dev") {
  config.mode = 'development';
  config.output = {
    filename: 'bundled.js',
    path: path.resolve(__dirname, 'dist')
  }
  cssConfig.use.unshift('style-loader'); //3. Inject styles into DOM
  // Webpack Dev Server
  config.devServer = {
    before: (app, server) => server._watch('./app/**/*.html'),
    contentBase: path.join(__dirname, 'app'),
    hot: true,
    port: 3000,
    host: '0.0.0.0'
  }
  config.plugins.push(
    new StylelintPlugin({
      configFile: '.stylelintrc.json',
      context: 'app',
      files: '**/*.css',
      syntax: 'scss',
      failOnError: false,
      quiet: false,
      emitErrors: true // by default this is to true to check the CSS lint errors
    })
  )
}

// PRODUCTION Configuration: =======================

if (currentTask == "build") {
  config.mode = 'production';
  cssConfig.use.unshift(MiniCSSExtractPlugin.loader); //3. Extract css into files
  config.output = {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  }
  config.optimization = {
    splitChunks: { chunks: "all" },
    minimizer: [
      // CSS minification
      new OptimizeCssAssetsPlugin({ cssProcessor: require('clean-css') }),
      new TerserPlugin() // JS default minification
    ]
  }
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCSSExtractPlugin({ filename: "styles.[chunkhash].css" }),
    new RunAfterCompile(),
    ...pages
  )
}

module.exports = config;