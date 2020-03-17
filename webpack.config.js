const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const fse = require('fs-extra');

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
      fse.copySync('./app/assets/images', './dist/assets/images');
      fse.copySync('./app/assets/fonts', './dist/assets/fonts');
    })
  }
}

let cssConfig = {
  test: /\.css$/i,
  use: [
    'css-loader?url=false', //2. Turns css into common js
    {
      loader: 'postcss-loader', //1. Turns postCSS into regular css
      options: {
        parser: require('postcss-comment'),
        plugins: postCSSPlugins,
        sourceMap: true
      }
    }
  ]
}

let pages = fse.readdirSync('./app')
  .filter(file => file.endsWith('.html'))
  .map(page => {
    return new HtmlWebpackPlugin({ // grabs html file
      filename: `./${page}`, // relative to root of the application
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
      cssConfig,
      // {
      //   test: /\.(woff|woff2|eot|ttf|svg)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: 'fonts/[name].[ext]',
      //     publicPath: '/'
      //   },
      // },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   loader: 'file-loader',
      //   options: {
      //     name: 'img/[name].[ext]',
      //     publicPath: '/'
      //   },
      // }

      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './images/',
              publicPath: './images/'
            }
          },
          'url-loader?limit=100000'
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: './fonts/',
            publicPath: './fonts/'
          }
        }]
      }
    ]
  },
  plugins: pages
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
    filename: 'assets/scripts/[name].[chunkhash].js',
    chunkFilename: 'assets/scripts/[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  }
  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  });
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
    new MiniCSSExtractPlugin({
      filename: "assets/styles/styles.[chunkhash].css"
    }),
    new RunAfterCompile()
  )
}

module.exports = config;