import { connect } from 'react-redux';

import { getFiles, sendGlobalError, showFile, deleteFile, changeFileName, download } from '../actions/actions';

import ShowFile from './ShowFile';
import DropdownMenu from './DropdownMenu';
import Rename from './Rename';

import '../styles/CloudStorage.sass';

const CloudStorage = createReactClass({

    getInitialState() {
        return {
            loading: true,
            files: [],
            showFile: {},
            dropMenu: {
                show: false,
                x: 0,
                y: 0,
                target: ''
            },
            rename: {
                show: false
            }
        }
    },

    componentDidMount() {
        this.props.getFiles(user)
            .then(res => {
                this.setState({
                    loading: false
                });
            })
            .catch(err => {
                let error = err.response ? err.response.data.error : (err.request ? err.request : err.message);
                this.props.sendGlobalError(error);
                this.setState({
                    loading: false
                });
            });

    },

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.files !== this.props.files) {
            this.setState({
                files: this.props.globalError ? [] : this.props.files
            });
            if(this.refs.list) {
                setTimeout(() => {
                    this.refs.list.scrollTop = 9999;
                }, 100)

            }

        };
    },

    onFileClick(e) {
        e.preventDefault();
        if(this.renameTarget) {
            this.cancelRenameFile();
        };

        this.hideDropMenu();

        let type = e.currentTarget.getAttribute('data');
        let id = e.currentTarget.getAttribute('id');
        let filename = e.target.innerText;

        if(this.state.showFile.filename === filename) return;

        this.setState({
            showFile: {}
        });

        this.props.showFile({
            id,
            type,
            userName: user
        }).then(res => {
            this.setState({
                showFile: {
                    filename: res.data.filename,
                    type: res.data.type,
                    file: res.data.file,
                    description: res.data.description
                }
            });
        });
    },

    hideDropMenu() {
        this.setState({
            dropMenu: {
                show: false,
                x: 0,
                y: 0,
                target: this.state.dropMenu.target
            }
        });
    },

    rightClick(e) {
        e.preventDefault();
        let x = e.clientX;
        let y = e.clientY;
        this.setState({
            dropMenu: {
                show: true,
                x,
                y,
                target: {
                    id: e.currentTarget.getAttribute('id'),
                    type: e.currentTarget.getAttribute('data'),
                    filename: e.target.innerText
                }
            },
            rename: false
        });
        this.cancelRenameFile();

        document.body.addEventListener('click', e => {
            if(e.target.nodeName === 'LI') return;
            this.hideDropMenu();
        });
        document.body.addEventListener('keyup', e => {
            if(e.keyCode === 27) this.hideDropMenu();
        });
    },

    deleteFile() {
        this.props.deleteFile(this.state.dropMenu.target);
        if(this.state.dropMenu.target.filename === this.state.showFile.filename) {
            this.setState({
                showFile: {}
            });
        }
        this.hideDropMenu();
    },

    renameFile() {
        if(this.renameTarget) {
            this.renameTarget.classList.remove('showRename');
        };
        this.renameTarget = document.getElementById(this.state.dropMenu.target.id);
        this.renameTarget.classList.add('showRename');
        this.hideDropMenu();
        this.setState({
            rename: true
        });
        if(this.state.showFile) {
            this.setState({
                showFile: {}
            })
        };
    },

    cancelRenameFile() {
        if(this.renameTarget) {
            this.renameTarget.classList.remove('showRename');
            this.renameTarget = null;
            this.setState({
                rename: false
            });
        }
    },

    changeFileName(filename) {
        let id = this.state.dropMenu.target.filename;
        if(filename === this.state.dropMenu.target.filename) {
            this.cancelRenameFile();
            return;
        };
        this.props.changeFileName({ id, filename })
            .then(() => this.cancelRenameFile());
    },

    downloadFile() {
        this.hideDropMenu();
        download(this.state.dropMenu.target.filename, user, this.state.dropMenu.target.type)
    },

    render() {
        return (
            <div id="CloudStorage" ref="main">
                <div className="row">

                    <div className="col-md-6">
                        {this.state.loading ? <div className="loading">Loading files...</div> :
                            <ul ref="list">
                                {this.state.files.map((file, i) =>
                                    <li
                                        onContextMenu={this.rightClick}
                                        onClick={this.onFileClick}
                                        ref="li"
                                        id={file._id}
                                        data={file.contentType}
                                        key={i}>

                                        <p className={this.state.rename.show && 'hide'}>{file.filename}</p>
                                        <Rename
                                            value={this.state.dropMenu.target.filename}
                                            show={this.state.rename}
                                            cancelRenameFile={this.cancelRenameFile}
                                            changeFileName={this.changeFileName}
                                        />
                                    </li>
                                )
                                }
                            </ul>
                        }
                        {(this.state.dropMenu.show && !this.props.globalError) &&
                        <DropdownMenu
                            x={this.state.dropMenu.x}
                            y={this.state.dropMenu.y}
                            deleteFile={this.deleteFile}
                            renameFile={this.renameFile}
                            downloadFile={this.downloadFile}
                        />
                        }
                    </div>

                    <div className="col-md-6">
                        {(this.state.showFile.type && !this.props.globalError) &&
                        <ShowFile
                            file={this.state.showFile.file}
                            filename={this.state.showFile.filename}
                            type={this.state.showFile.type.split('/')[0]}
                            description={this.state.showFile.description}
                        />}
                        {this.props.globalError && <div className="error">{this.props.globalError}</div>}

                    </div>
                </div>
            </div>
        );
    }
});

function mapState(state) {
    return {
        files: state.files,
        globalError: state.globalError
    }
};

export default connect(mapState, { getFiles, sendGlobalError, showFile, deleteFile, changeFileName })(CloudStorage);