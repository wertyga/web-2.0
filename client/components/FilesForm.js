import Progress from './Progress';

import axios from 'axios';

import '../styles/FilesForm.sass';

const FilesForm = createReactClass ({
    
    getInitialState() {
        return {
            label: '',
            error: '',
            width: 0,
            total: 0,
            loaded: 0
        }
    },

    onProgress(e) {
        if(this.state.error) return;
        let total = e.total,
            loaded = e.loaded,
            onePer = +total / 100;
        this.setState({
            loaded,
            width: loaded / onePer,
            total
        });
    },

    onSubmit(e) {
        e.preventDefault();
        if(!this.file) {
            this.setState({
                error: 'No files have been chosen'
            });
            return;
        };

        let self = this;

        let formData = new FormData();
        formData.append('user', 'wertyga');
        formData.append('appendFile', this.file);

        let cancelToken = axios.CancelToken;
        this.source = cancelToken.source();

        axios({
            method: 'post',
            url: '/api/get-files',
            data: formData,
            onUploadProgress(e) {
                if(self.state.error) return;
                return self.onProgress(e)
            },
            cancelToken: this.source.token
        }).then(res => {
            setTimeout(() => {
                this.setState({
                    width: 0,
                    total: 0,
                    loaded: 0
                });
            }, 3000)
        })
            .catch(err => {
                if(axios.isCancel(err)) {
                    this.setState({
                        error: err.message,
                        width: 0,
                        total: 0,
                        loaded: 0
                    });
                } else {
                    this.setState({
                        error: err.response ? err.response.data.error : (err.request ? err.request : err.message),
                        width: 0,
                        total: 0,
                        loaded: 0
                    })
                }
            })
    },

    cancelClick() {
        this.source.cancel('Canceled by the user')
    },

    labelClick() {
        this.file = this.refs.input.files[0];
        if(this.file) {
            let fileName = this.refs.input.files[0].name;
            this.setState({
                label: fileName,
                error: '',
                width: 0,
                total: 0,
                loaded: 0
            });
        }
    },

    deleteClick() {
        this.setState({
            label: '',
            error: '',
            width: 0,
            total: 0,
            loaded: 0
        });
        this.file = null;
    },

    render() {
        return (

            <div id="FilesForm">

                <div className="row justify-content-between">
                <div className="col-md-6">
                    <form className="input-group" encType="multipart/form-data" >
                        <label htmlFor="file-input">{!this.state.label ? 'Browse to upload files...' : this.state.label}</label>
                        <input ref="input" type="file" name="fileFromInput" onChange={this.labelClick} className="form-control" id="file-input"/>
                    </form>
                </div>

                <div className="col-md-5">
                    <div className="buttons-group">
                        <button type="text" disabled={!!this.state.width} className="btn btn-success" onClick={this.onSubmit}>Submit</button>
                        <button className="btn btn-danger" onClick={this.deleteClick}>Delete chosen file</button>
                    </div>
                </div>

                <div className="col-12">
                    <div className="error">
                        {this.state.error && <div className="alert alert-danger" role="alert">{this.state.error}</div>}
                    </div>
                    <Progress
                        width={this.state.width}
                        loaded={this.state.loaded}
                        total={this.state.total}
                        cancelClick={this.cancelClick}
                    />
                </div>
                </div>
            </div>

        );
    }
});

export default FilesForm;