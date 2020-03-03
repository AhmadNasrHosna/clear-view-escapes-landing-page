const path = require('path');
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


module.exports = {
  entry: './app/assets/scripts/App.js',
  output: {
    filename: 'bundled.js',
    path: path.resolve(__dirname, 'app')
  },
  // Webpack Dev Server
  devServer: {
    before: (app, server) => server._watch('./app/**/*.html'),
    contentBase: path.join(__dirname, 'app'),
    hot: true,
    port: 3000,
    host: '0.0.0.0'
  },
  mode: 'development',
  module: {
    rules: [{
      test: /\.css$/i,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            parser: require('postcss-comment'),
            plugins: postCSSPlugins
          }
        }
      ]
    }]
  },
  plugins: [
    new StylelintPlugin({
      configFile: '.stylelintrc.json',
      context: 'app',
      files: '**/*.css',
      syntax: 'scss',
      failOnError: false,
      quiet: false,
      emitErrors: true // by default this is to true to check the CSS lint errors
    })
  ]
}