const path = require('path'),
    merge = require('lodash.merge');

let MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function(config) {

    let configWebpack = config.webpack;
    let isProduction = config.env === 'production';

    // 样式loader
    let commonLoaders = [
        {
            loader: 'cache-loader',
            options: {
                // provide a cache directory where cache items should be stored
                cacheDirectory: path.resolve('.cache')
            }
        },
        {
            loader: 'css-loader',
            options: {
                localIdentName: '[name]-[local]-[hash:base64:5]',
                module: config.webpack.cssModule,
                autoprefixer: true,
                minimize: true,
                importLoaders: 1
            }
        },
        {
            loader: 'postcss-loader'
        }
    ];

    if (isProduction) {
        commonLoaders.splice(0, 0, { loader: MiniCssExtractPlugin.loader });
    }
    else {
        commonLoaders.splice(0, 0, { loader: 'style-loader' });
    }

    const styleRules = {
        css: {
            test: /\.css$/,
            use: commonLoaders,
            include: path.resolve(config.webpack.path.src)
        },
        less: {
            test: /\.less$/,
            use: merge([], commonLoaders).concat([{
                loader: 'less-loader'
            }])
        },
        stylus: {
            test: /\.styl$/,
            use: merge([], commonLoaders).concat([{
                loader: 'stylus-loader'
            }])
        },
        sass: {
            test: /\.s(a|c)ss$/,
            use: merge([], commonLoaders).concat([{
                loader: 'sass-loader'
            }])
        }
    };

    let rules = [];

    configWebpack.style.forEach((styleParam) => {
        style = (styleParam === 'scss') ? 'sass' : styleParam;
        let rule = styleRules[style] || '';
        rule && rules.push(rule);
    });

    return rules;
};
