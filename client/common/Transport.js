import axios from 'axios';

export default function(self) {
    this.xhr =  {
        onSubmit() {
            if(self.state.error) return;
            if(!self.file) {
                self.setState({
                    error: 'No files have been chosen'
                });
                return;
            };

            this.formData = new FormData();
            this.formData.append('user', 'wertyga');
            this.formData.append('appendFile', self.file);

            let fileName = self.file.name;
            self.props.checkFile({
                fileName,
                user: 'wertyga'
            })
                .then(res => {
                    this.sendFile({ data: this.formData })
                })
                .catch(err => {
                    self.setState({
                        error: err.response ? err.response.data.error : (err.request ? err.request : err.message)
                    });
                });
        },

        sendFile(opt) {
            self.setState({
                error: ''
            });
            let cancelToken = axios.CancelToken;
            this.source = cancelToken.source();

            self.props.sendFiles({
                data: opt.data,
                onUploadProgress(e) {
                    if(self.state.error) return;
                    return self.onProgress(e)
                },
                cancelToken: this.source.token
            }).then(res => {
                setTimeout(() => {
                    self.setState({
                        width: 0,
                        total: 0,
                        loaded: 0
                    });
                    self.deleteClick();
                }, 3000)
            })
                .catch(err => {
                    if(axios.isCancel(err)) {
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
            this.sendFile({ data: this.formData })
        },

        cancel() {
            this.source.cancel('Canceled by the user');
            self.setState({
                width: 0,
                total: 0,
                loaded: 0
            })
        }
    }
}