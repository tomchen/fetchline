module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    library: 'fetchline',
    libraryExport: "default",
    libraryTarget: 'umd',
  },
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts(x*)?$/,
        exclude: [/node_modules/, /deno\.ts/],
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'config/tsconfig.umd.json',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
}
