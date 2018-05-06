const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    'serpentary': "./src/index.tsx",
    'styles': "./styles/index.sass"
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist"
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json", ".sass", ".css"]
  },

  module: {
    rules: [

      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },

      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "serpentary.css"
    })
  ],

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies and allows browsers to cache those libraries between builds.
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
};
