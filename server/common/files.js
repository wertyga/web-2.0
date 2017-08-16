import multiparty from 'multiparty';

export function saveFile(opt) {
    let part = opt.part;
    let res = opt.res;
    let gfs = opt.gfs;

    let writeStream = gfs.createWriteStream({
        filename: part.filename,
        mode: 'w',
        content_type: part.headers['content-type']
    });
    writeStream.on('close', file => {
        writeStream.end();
        res.json({...file});
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

    return Promise.resolve(gfs.remove({_id: id}, err => {
        if(err) res.status(500).json({ error: 'Can\'t remove file' })
    }));
};

export function writeFile(opt) {
    let res = opt.res;
    let gfs = opt.gfs;
    let req = opt.req;

    let form = new multiparty.Form();
    let user;

    form.on('error', function(err) {
        if(err.message === 'Request aborted') return;
        res.status(400).json({error: 'Error parsing form: ' + err.stack});
    });

    form.on('part', part => {
        if(!part.filename) part.resume();

        gfs.findOne({filename: part.filename}, (err, file) => {
            if(err) res.status(500).json({error: 'Can\'t connect to DB'});
            if(!user) res.status(400).json({ error: 'No user provided' });
            if(file) {
                deleteFile({ id: file._id, part, gfs, res })
                    .then(resp => saveFile({ part, res, gfs }))
            } else {
                saveFile({ part, res, gfs });
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