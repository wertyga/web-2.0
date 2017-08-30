import Progress from './Progress';

import { sendFiles, checkFile } from '../actions/actions';
import Transport from '../common/Socket';

import axios from 'axios';
import { connect } from 'react-redux';

import '../styles/FilesForm.sass';


const FilesForm = createReactClass ({
    
    getInitialState() {
        return {
            label: '',
            error: this.props.globalError || '',
            width: 0,
            total: 0,
            loaded: 0
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.globalError !== this.props.globalError) {
            this.setState({
                error: this.props.globalError
            });
        }
    },

    componentDidMount() {
        this.transport = Transport(this);
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

    onSubmit() {
        this.transport.onSubmit();
        // if(this.state.error) return;
        // if(!this.file) {
        //     this.setState({
        //         error: 'No files have been chosen'
        //     });
        //     return;
        // };
        //
        // this.formData = new FormData();
        // this.formData.append('user', 'wertyga');
        // this.formData.append('appendFile', this.file);
        //
        // let fileName = this.file.name;
        // this.props.checkFile({
        //     fileName,
        //     user: 'wertyga'
        // })
        //     .then(res => {
        //         this.sendFile({ data: this.formData })
        //     })
        //     .catch(err => {
        //         this.setState({
        //             error: err.response ? err.response.data.error : (err.request ? err.request : err.message)
        //         });
        //     });
    },

    cancelClick() {
        this.transport.cancel();
        // this.source.cancel('Canceled by the user');
        // this.setState({
        //     width: 0,
        //     total: 0,
        //     loaded: 0
        // })
    },

    // sendFile(opt) {
    //     this.setState({
    //         error: ''
    //     });
    //     let self = this;
    //     let cancelToken = axios.CancelToken;
    //     this.source = cancelToken.source();
    //
    //     this.props.sendFiles({
    //         data: opt.data,
    //         onUploadProgress(e) {
    //             if(self.state.error) return;
    //             return self.onProgress(e)
    //         },
    //         cancelToken: this.source.token
    //     }).then(res => {
    //         setTimeout(() => {
    //             this.setState({
    //                 width: 0,
    //                 total: 0,
    //                 loaded: 0
    //             });
    //             this.deleteClick();
    //         }, 3000)
    //     })
    //         .catch(err => {
    //             if(axios.isCancel(err)) {
    //                 this.setState({
    //                     error: err.message,
    //                     width: 0,
    //                     total: 0,
    //                     loaded: 0
    //                 });
    //             } else {
    //                 this.setState({
    //                     error: err.response ? err.response.data.error : (err.request ? err.request : err.message),
    //                     width: 0,
    //                     total: 0,
    //                     loaded: 0
    //                 })
    //             }
    //         })
    // },

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
        this.refs.input.value = '';
    },

    overwrite(e) {
        this.transport.overwrite();
        // this.setState({
        //     error: ''
        // });
        // this.sendFile({ data: this.formData })
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
                        {this.state.error &&
                            (this.state.error === 'existFile' ?
                                    <div className="alert alert-danger" role="alert">
                                        <p>File exist - Overwrite ?</p>
                                        <div className="btn btn-warning" onClick={this.overwrite}>Yes</div>
                                        <div className="btn btn-danger" onClick={this.deleteClick}>No</div>
                                    </div>
                                    :
                                    <div className="alert alert-danger" role="alert">{this.state.error}</div>
                            )
                        }
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

function mapState(state) {
    return {
        globalError: state.globalError
    }
};

export default connect(mapState, { sendFiles, checkFile })(FilesForm);