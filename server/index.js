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

const PORT = 3001;
const app = express();
const server = require('http').Server(app);

mongoose.connect('mongodb://localhost/web-2-0', { useMongoClient: true }, (err, db) => {
    if(err) {
        console.error.bind(console, 'connection error:');
    };
});

let conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
let gfs;

server.listen(PORT, () => console.log(`Server run on: ${PORT} port`));

let compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
}));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());

conn.once('open', () => {
    console.log('--Connect to Mongo--');

    gfs = Grid(conn.db);

    app.post('/api/load-files', (req, res) => {
        writeFile({ req, res, gfs });
    });

    app.post('/api/fetch-files', (req, res) => {
        let file = gfs.files.find({}).toArray((err, files) => {
            // if(files.length < 1) res.end();
            if(err) res.status(500).json({ error: 'Can\'t get files' });
            res.json({ files })
        });
    });

    app.post('/api/check-file', (req, res) => {
        let { fileNames, user } = req.body;
        fileNames = fileNames.map(name => { return { filename: name } })

        if(!user) res.status(400).json({ error: 'No user provided' });

        gfs.files.find({ $or: fileNames }).toArray((err, files) => {
            if(err) res.status(500).json({ error: 'Can\'t check file' });
            if(files.length > 0) {
                res.status(400).json({ error: {
                    existFile: true,
                    files: files.map(item => item.filename)
                } });
            } else {
                res.json('no such file')
            }
        });
    });

    app.post('/api/show-file', (req, res) => {
        let { id, filename, userName } = req.body;
        if(!id) res.end();

        gfs.findOne({_id: id}, (err, file) => {
            if(err) console.log(err)
            let fileType = file.contentType.split('/')[0];

                if(fileType === 'image' || fileType === 'text') {
                    let readstream = gfs.createReadStream(file);
                    let data = [];
                    readstream.on('data', chunk => data.push(chunk));
                    readstream.on('end', () => {
                        data = Buffer.concat(data);
                        data = (fileType === 'image' ?
                            `data:${file.contentType};base64,` + Buffer(data).toString('base64') : Buffer(data).toString());
                        res.json({
                            filename: file.filename,
                            type: file.contentType,
                            file: data,
                            description: file
                        })
                    });

                } else {
                    res.json({
                        filename: file.filename,
                        type: file.contentType,
                        file: file.filename,
                        description: file
                    })

                }

        })
    });

    app.post('/api/delete-file', (req, res) => {
        deleteFile({ gfs, res, id: req.body.id })
            .then(resp => res.json('success delete'));
    });

    app.post('/api/change-file', (req, res) => {
        const { id, filename } = req.body;

        gfs.files.update({filename: id}, {$set: { filename }}, (err, file) => {
            if(err) {
                res.status(500).json({ error: 'Rename file failure' })
            } else {
                gfs.findOne({ filename }, (err, file) => {
                    if(err) {
                        res.status(500).json({ error: 'Get file failure' });
                    } else {
                        res.json({...file})
                    }
                });
            }
        });
    });

});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
});