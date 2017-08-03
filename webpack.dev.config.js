import webpack from 'webpack';
import path from 'path';

export default {
    devtool: 'eval-source-map',

    entry: [
        'webpack-hot-middleware/client',
        path.join(__dirname, 'client/index.js')
    ],

    output: {
        path: '/',
        publicPath: '/',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['react-hot-loader', 'babel-loader']

            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.sass$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.eot$|.ttf$|.woff$|.jpg$|.png$/,
                loaders: ['file-loader']
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
            '$': 'jquery'
        })
    ],

    resolve: {
        extensions: ['.js', '.jsx']
    }
}