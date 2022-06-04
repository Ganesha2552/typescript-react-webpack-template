import path from "path";
import webpack, {Configuration} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import {TsconfigPathsPlugin} from "tsconfig-paths-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const webpackConfig = (env): Configuration => ({
    entry: "./src/index.tsx",
    ...(env.production || !env.development ? {} : {devtool: "eval-source-map"}),
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        //TODO waiting on https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/61
        //@ts-ignore
        plugins: [new TsconfigPathsPlugin()]
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "build.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                },
                exclude: /dist/
            },
           {
            test: /\.(png|jpg|gif|svg)$/i,
            type: 'asset/resource',
           },
           {
            test: /\.css$/,
            use: env.production
              ? [MiniCssExtractPlugin.loader, 
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                        importLoaders: 2,

                    },
                }, {
                    loader: 'postcss-loader',
                    options: {
                      sourceMap: true,
                    },
                  }]
              : [{
                loader: 'style-loader'
              }, {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                    importLoaders: 2,

                },
            }, {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                },
              }],
           }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new webpack.DefinePlugin({
            "process.env.PRODUCTION": env.production || !env.development,
            "process.env.NAME": JSON.stringify(require("./package.json").name),
            "process.env.VERSION": JSON.stringify(require("./package.json").version)
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
  }),
  new ESLintPlugin({
    extensions: ["js", "jsx", "ts", "tsx"],
  }),
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css",
    chunkFilename: "[id].[contenthash].css",
  }) as unknown as webpack.WebpackPluginInstance,
  
    ]
});

export default webpackConfig;