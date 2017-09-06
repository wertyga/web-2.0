import Progress from './Progress';

import { sendFiles, checkFile } from '../actions/actions';
import Transport from '../common/Xhr';

import { connect } from 'react-redux';

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

    componentDidMount() {
        this.transport = Transport(this);
    },

    onProgress(e) {
        if(this.state.error) return;
        let total = e.total / 1000000,
            loaded = e.loaded / 1000000,
            onePer = +total / 100;
        this.setState({
            loaded,
            width: loaded / onePer,
            total
        });
    },

    onSubmit() {
        this.transport.onSubmit(user);
    },

    cancelClick() {
        this.transport.cancel();
    },

    labelClick() {
        this.files = this.refs.input.files;
        if(this.files) {
            this.fileNames = [];
            for(let i = 0; i < this.files.length; i++) {
                this.fileNames.push(this.files[i].name)
            };

            this.setState({
                label: this.fileNames,
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

    },

    render() {
        return (

            <div id="FilesForm">

                <div className="row justify-content-between">
                <div className="col-md-6">
                    <form className="input-group" encType="multipart/form-data" >
                        <label htmlFor="file-input">{!this.state.label ? 'Browse to upload files...' : this.state.label.join('; ')}</label>
                        <input ref="input" type="file" multiple name="fileFromInput" onChange={this.labelClick} className="form-control" id="file-input"/>
                    </form>
                </div>

                <div className="col-md-5">
                    <div className="buttons-group">
                        <button type="text" disabled={!!this.state.width} className="btn btn-success" onClick={this.onSubmit}>Submit</button>
                        <button className="btn btn-danger" disabled={!!this.state.width} onClick={this.deleteClick}>Delete chosen file</button>
                    </div>
                </div>

                <div className="col-12">
                    <div className="error">
                        {this.state.error &&
                        (this.state.error.existFile ?
                                <div className="alert alert-danger" role="alert">
                                    <p>Files exist: {this.state.error.files.join(' AND ')} - Overwrite ?</p>
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


export default connect(null, { sendFiles, checkFile })(FilesForm);