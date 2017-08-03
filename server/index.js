import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackConfig from '../webpack.dev.config';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMiddleware from 'webpack-dev-middleware';
import bodyParser from 'body-parser';
import multiparty from 'multiparty';

import fs from 'fs';
import mkdirp from 'mkdirp';

const app = express();
let compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
}));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());


app.post('/api/get-files', (req, res) => {
    let form = new multiparty.Form();
    let user;

    form.on('error', function(err) {
        if(err.message === 'Request aborted') return;
        res.status(400).json({error: 'Error parsing form: ' + err.stack});
    });

    form.on('part', part => {
        if(!part.filename) part.resume();

        if(!user) {
            res.status(400).json({ error: 'No user provided' });
        };
        let dirname = path.join(__dirname, user);
        fs.stat(dirname, (err, stat) => {
            if(err) {
                if(err.code == 'ENOENT') {
                    fs.mkdirSync(dirname);
                } else {
                    res.status(500).json({ error: 'Can\'t check directory' });
                }
            };

            let writeStream = fs.createWriteStream(path.join(dirname, part.filename));
            part.pipe(writeStream);

        });

        part.on('error', err => {
            res.status(400).json({error: 'Write error'})
        });
    });

    form.on('field', (name, value) => {
        if(name === 'user') {
            user = value
        } else {
            res.status(400).json({ error: 'No user provided' });
        }
    });

    form.on('close', () => {
        res.status(200).json('success');
    });

    form.parse(req);

});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
});



app.listen(3002, () => console.log('Server run on 3000 port'));





