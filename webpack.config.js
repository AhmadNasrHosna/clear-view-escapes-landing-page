const path = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');
const postCSSPlugins = [
  new StylelintPlugin({
    configFile: '.stylelintrc',
    context: 'src',
    files: '**/*.css',
    failOnError: false,
    quiet: false,
    emitErrors: true
  }),
  require('postcss-import'),
  require('postcss-mixins'),
  require('postcss-simple-vars'),
  require('postcss-conditionals'),
  require('autoprefixer'),
  require('postcss-nested'),
  require('postcss-logical')(),
  require('postcss-preset-env')({ stage: 0 })

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
  }
}





/*
module.exports.styleLint = (isProd = false) => {
  const options = {
    configFile: './.stylelintrc.json',
    files: '**\/*.less',
    format: 'less',
    failOnError: false,
    quiet: false,
    emitErrors: isProd
  };
  return new StyleLintPlugin(options);
};

const postCSSPlugins = [
  new StylelintPlugin({
    configFile: './.stylelintrc.json',
    files: '**\/*.css',
    format: 'css',
    failOnError: false,
    quiet: false
  }),
*/