import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';

import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import secret from './secret';

import { getUrl } from '../index';


function searchExistFile(username, filename) {
    let files;
    try {
        files = fs.readdirSync(getUrl(username));
    } catch (err) {
        throw new Error('Can\'t read user');
    };

    return files.find(jwtFile => {
        try {
            const decoded = jwt.verify(jwtFile.split('!!.')[0], secret);
            if(decoded.filename === filename) {
                return true;
            };
        } catch(err) {
            fs.appendFile(path.join(__dirname, '../storage', 'errors.log'), `${jwtFile}:\n ${err}\n`, err => {
                if(err) console.log(err)
            });
            return false;
        }
    });

};

function saveFile(opt) {
    let part = opt.part;
    let res = opt.res;
    let user = opt.user;
    const signObj = {
        contentType: part.headers['content-type'],
        filename: part.filename,
        uploadDate: new Date().toLocaleString(),
        length: part.byteCount
    };
    const cypherFile = jwt.sign(signObj, secret);

    const existFile = searchExistFile(user, part.filename);
    if(existFile) {
        deleteFile(user, existFile);
    };

    let writeStream = fs.createWriteStream(path.join(getUrl(user), `${cypherFile}!!.${part.filename.split('.')[1]}`));
    part.on('error', err => {
        res.status(500).json({error: 'Write error'});
    });

    part.pipe(writeStream);

    writeStream.on('finish', () => {
        res.json(Object.assign(signObj, { _id:  `${cypherFile}!!.${part.filename.split('.')[1]}` }))
    });
    writeStream.on('error', err => {
        res.status(500).json({error: 'Write error'});
    });
};

export function deleteFile(username, filename) {
    fs.unlink(path.join(getUrl(username), filename))
};

export function writeFile(opt) {
    let res = opt.res;
    let req = opt.req;

    let form = new multiparty.Form();
    let user;

    form.on('error', function(err) {
        console.log(err)
        if(err.message === 'Request aborted') {
            console.log(err)
        };
        res.status(400).json({error: 'Error parsing form: ' + err.stack});
    });
    form.on('part', part => {
        if(!part.filename) part.resume();

        saveFile({ res, part, user })
    });
    form.on('field', (name, value) => {
        if(name === 'user') {
            user = value
        };
    });
    form.parse(req);
};

export function checkFile(req, res) {
    let { fileName, user } = req.body;

    if(!user) res.status(400).json({ error: 'No user provided' });

    try {
        if(searchExistFile(user, fileName)) {
            res.status(400).json({error: 'existFile'});
        } else {
            res.json('no such file');
        }
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
};

export function decodeJwtFile(jwtFile) {
    try {
        return jwt.verify(jwtFile.split('!!.')[0], secret);
    } catch(err) {};
}
