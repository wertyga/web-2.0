import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackConfig from '../webpack.dev.config';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMiddleware from 'webpack-dev-middleware';
import bodyParser from 'body-parser';

import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
mongoose.Promise = require('bluebird');

import { writeFile, deleteFile } from './common/files';

import fs from 'fs';

mongoose.connect('mongodb://localhost/web-2-0', { useMongoClient: true }, (err, db) => {
    if(err) {
        console.error.bind(console, 'connection error:');
    };
});
let conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
let gfs;

const PORT = 3003;
const app = express();
const server = require('http').Server(app);
let io = require('socket.io')(server);
server.listen(PORT, () => console.log(`Server run on: ${PORT} port`));

conn.once('open', () => {
    console.log('--Connect to Mongo--');

    gfs = Grid(conn.db);

    app.post('/api/load-files', (req, res) => {
        writeFile({ req, res, gfs });
    });

    app.post('/api/fetch-files', (req, res) => {
        let file = gfs.files.find({}).toArray((err, files) => {
            if(files.legnth < 1) res.end();
            if(err) res.status(500).json({ error: 'Can\'t get files' });
            res.json({ files })
        });
    });

    app.post('/api/check-file', (req, res) => {
        let { fileName, user } = req.body;

        if(!user) res.status(400).json({ error: 'No user provided' });

        gfs.findOne({ filename: fileName }, (err, file) => {
            if(err) res.status(500).json({ error: 'Can\'t check file' });

            if(file) {
                res.status(400).json({ error: 'existFile' });
            } else {
                res.json('no such file')
            };
        });
    });

    app.post('/api/show-file', (req, res) => {
        let { id, filename, userName } = req.body;
        if(!id) res.end();

        gfs.findOne({_id: id}, (err, file) => {
            let fileType = file.contentType.split('/')[0];

            if(fileType !== 'image' && fileType !== 'text' && fileType !== 'video') {
                res.json({
                    filename: file.filename,
                    type: 'text/plain',
                    file: file.filename
                })
            };
            let readstream = gfs.createReadStream(file);
            let data = [];
            readstream.on('data', chunk => data.push(chunk));
            readstream.on('end', () => {

                if(fileType === 'image') {
                    data = Buffer.concat(data);
                    data = `data:${file.contentType};base64,` + Buffer(data).toString('base64');
                    res.json({
                        filename: file.filename,
                        type: file.contentType,
                        file: data
                    })
                } else if(fileType === 'text') {
                    data = Buffer.concat(data);
                    data = Buffer(data).toString()
                    res.json({
                        filename: file.filename,
                        type: file.contentType,
                        file: data
                    })
                } else if(fileType === 'video') {
                    data = Buffer.concat(data);
                    data = `data:${file.contentType};base64,` + Buffer(data).toString('base64');
                    res.json({
                        filename: file.filename,
                        type: file.contentType,
                        file: data
                    })
                };

            })

        })
    });

    app.post('/api/delete-file', (req, res) => {
        deleteFile({ id: req.id, res, gfs })
    });


    io.on('connection', socket => {
        console.log('connect new client');

        socket.on('submit', data => {
            console.log(data)
        });
    });

});




let compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
}));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
});














