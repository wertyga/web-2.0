import multiparty from 'multiparty';

export function saveFile(opt) {
    let part = opt.part;
    let res = opt.res;
    let gfs = opt.gfs;
    let files = opt.files;

    let writeStream = gfs.createWriteStream({
        filename: part.filename,
        mode: 'w',
        content_type: part.headers['content-type']
    });
    writeStream.on('close', file => {
        files.push(file);
        writeStream.end();
        if(files.length === opt.count.value) {
            res.json({ files });
        }
    });

    part.pipe(writeStream);

    part.on('error', err => {
        res.status(400).json({error: 'Write error'})
    });

};

export function deleteFile(opt) {
    let res = opt.res;
    let gfs = opt.gfs;
    let id = opt.id;

    return new Promise((resolve, rej) => {
        try {
            resolve(gfs.remove({_id: id}));
        } catch(err) {
            rej(new Error('Can\'t remove file'));
        }
    });
};

export function writeFile(opt) {
    let res = opt.res;
    let gfs = opt.gfs;
    let req = opt.req;

    let form = new multiparty.Form();
    let user;
    let signer = { value: false };
    let files = [];
    let count = {
        value: 0
    };

    form.on('error', function(err) {
        if(err.message === 'Request aborted') return;
        res.status(400).json({error: 'Error parsing form: ' + err.stack});
    });

    form.on('part', part => {
        if(!part.filename) part.resume();

        count.value += 1;

        gfs.findOne({filename: part.filename}, (err, file) => {
            if(err) res.status(500).json({error: 'Can\'t connect to DB'});
            if(!user) res.status(400).json({ error: 'No user provided' });
            if(file) {
                deleteFile({ id: file._id, part, gfs, res })
                    .then(resp => saveFile({ part, res, gfs, signer, files, count }))
                    .catch(err => res.status(500).json({ error: err.message }))
            } else {
                saveFile({ part, res, gfs, signer, files, count });
            }
        });
    });

    form.on('field', (name, value) => {
        if(name === 'user') {
            user = value
        };
    });

    form.parse(req);
};