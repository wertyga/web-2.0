import axios from 'axios';


export default function(self) {
    return {
        onSubmit(user) {
            if (self.state.error) return;
            if (!self.files) {
                self.setState({
                    error: 'No files have been chosen'
                });
                return;
            }
            ;

            this.formData = new FormData();
            this.formData.append('user', user);

            for(let i = 0; i < self.files.length; i++) {
                this.formData.append(`appendFile-${i}`, self.files[i]);
            };

            self.props.checkFile({
                fileNames: self.fileNames,
                user
            })
                .then(res => {
                    this._sendFile({data: this.formData})
                })
                .catch(err => {
                    self.setState({
                        error: err.response ? err.response.data.error : (err.request ? err.request : err.message)
                    });
                });
        },

        _sendFile(opt) {
                self.setState({
                    error: ''
                });
                let cancelToken = axios.CancelToken;
                this._source = cancelToken.source();
                self.props.sendFiles({
                    data: opt.data,
                    onUploadProgress(e) {
                        if (self.state.error) return;
                        return self.onProgress(e)
                    },
                    cancelToken: this._source.token
                }).then(res => {
                    setTimeout(() => {
                        self.setState({
                            width: 0,
                            total: 0,
                            loaded: 0
                        });
                        self.deleteClick();
                    }, 1000)
                })
                    .catch(err => {
                        if (axios.isCancel(err)) {
                            self.setState({
                                error: err.message,
                                width: 0,
                                total: 0,
                                loaded: 0
                            });
                        } else {
                            self.setState({
                                error: err.response ? err.response.data.error : (err.request ? err.request : err.message),
                                width: 0,
                                total: 0,
                                loaded: 0
                            })
                        }
                    })
            },

        overwrite(e) {
                self.setState({
                    error: ''
                });
                this._sendFile({data: this.formData})
            },

        cancel() {
                this._source.cancel('Canceled by the user');
                self.setState({
                    width: 0,
                    total: 0,
                    loaded: 0
                });
            self.deleteClick();
            }
    }
};


