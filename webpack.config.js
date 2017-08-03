var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'eval-source-map',

    entry: [
        path.join(__dirname, './client/index.js')
    ],

    output: {
        path: path.join(__dirname, 'public'),
        publicPath: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['react-hot-loader', 'babel-loader'],
                include: path.join(__dirname, 'client')
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.sass$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.ProvidePlugin({
            'React': 'react',
            "createReactClass": "create-react-class",
            "PropTypes":"prop-types",
        })
    ],

    resolve: {
        extensions: ['.js', '.jsx']
    }
}