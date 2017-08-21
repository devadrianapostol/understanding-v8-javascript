module.exports = {
  entry: `./src/entry.js`,

  output: {
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      }
    ],
  },

  devtool: 'source-map',

  stats: {
    children: false,
  },
};