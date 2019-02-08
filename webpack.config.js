const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const SvgSpriteHtmlWebpackPlugin = require('svg-sprite-html-webpack');
const glob = require('glob');

const srcDir = './src/';

const genericDataFile = path.resolve(path.join(srcDir, 'data', 'data.json'));

// extends for twig
// const twigExtends = [];
// const folderPath = path.resolve(__dirname, './twig-extends');
// fs.readdirSync(folderPath).forEach((file) => {
//   twigExtends.push(require(path.join(folderPath, file)));
// });

const config = {
  entry: {
    app: './src/js/index.js',
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.twig$/,
        use: [
          'html-loader',
          {
            loader: 'twig-html-loader',
            options: {
              data: (context) => {
                const templatePath = context.resourcePath;

                const dataDir = path.resolve(path.join(srcDir, 'data'));
                const htmlDir = path.resolve(path.join(srcDir, 'html'));
                const htmlRelativePath = path.relative(htmlDir, templatePath);
                const specificDataFile = path.resolve(dataDir, htmlRelativePath.replace('.twig', '.json'));
                let gData = {};
                let sData = {};

                context.addDependency(genericDataFile);
                context.addDependency(specificDataFile);

                try {
                  gData = context.fs.readJsonSync(genericDataFile);
                } catch (e) {
                  console.log(`WARN: Unable to find data from ${path.relative(path.resolve('.'), genericDataFile)}`);
                }

                try {
                  sData = context.fs.readJsonSync(specificDataFile);
                } catch (e) {
                  console.log(`WARN: Unable to find data from ${path.relative(path.resolve('.'), specificDataFile)}`);
                }

                return Object.assign({}, gData, sData);
              },
            },
          },
        ],
      },
      {
        test: /src\/svg\/.*\.svg$/,
        use: SvgSpriteHtmlWebpackPlugin.getLoader(),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        exclude: /src\/svg/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            context: './src',
          },
        }],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
};

// html
const templates = glob.sync(path.join(__dirname, 'src', '**', '!(_)*.twig'));

templates.forEach((tpl) => {
  config.plugins.push(new HtmlWebpackPlugin({
    template: tpl,
    filename: path.join(path.relative(path.join(__dirname, 'src', 'html'), path.dirname(tpl)), `${path.basename(tpl, '.twig')}.html`),
    title: 'test',
    inject: /ajax/.test(tpl) ? false : 'head',
  }));
});

// plugin to manage script insert
config.plugins.push(new ScriptExtHtmlWebpackPlugin({
  defaultAttribute: 'defer',
}));

// svg symbols plugin
config.plugins.push(new SvgSpriteHtmlWebpackPlugin({
  includeFiles: [
    './src/svg/**/*.svg',
  ],
  generateSymbolId: (svgFilePath) => {
    const svgDir = path.resolve('./src/svg');
    const pathToSubDir = path.relative(svgDir, path.dirname(svgFilePath));
    const composed = pathToSubDir.split(path.sep);
    composed.push(path.basename(svgFilePath));

    return composed.join('-');
  },
}));

module.exports = config;
