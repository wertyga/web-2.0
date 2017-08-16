import { connect } from 'react-redux';

import { getFiles, sendGlobalError, showFile } from '../actions/actions';

import ShowFile from './ShowFile';

import '../styles/CloudStorage.sass';

const CloudStorage = createReactClass({

    getInitialState() {
        return {
            loading: true,
            files: [],
            showFile: {}
        }
    },

    componentDidMount() {
        this.props.getFiles()
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
        let isRightMB;
        e = e || window.event;

        if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = e.which == 3;
        else if ("button" in e)  // IE, Opera
            isRightMB = e.button == 2;
        if(isRightMB) {
            console.log(isRightMB)
        };

        let type = e.target.getAttribute('data');
        let id = e.target.getAttribute('id');
        let filename = e.target.innerText;

        this.setState({
            showFile: {}
        });

        this.props.showFile({
            id,
            filename,
            userName: 'wertyga'
        }).then(res => {
            this.setState({
                showFile: {
                    filename: res.data.filename,
                    type: res.data.type,
                    file: res.data.file
                }
            });
        });
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
                                    onClick={this.onFileClick}
                                    ref="li" id={file._id}
                                    data={file.contentType}
                                    key={i}>{file.filename}</li>)
                                }
                            </ul>
                        }
                        {this.props.globalError && <div className="error">{this.props.globalError}</div>}
                    </div>

                    <div className="col-md-6">
                        {this.state.showFile.type &&
                        <ShowFile
                            file={this.state.showFile.file}
                            filename={this.state.showFile.filename}
                            type={this.state.showFile.type.split('/')[0]}
                        />}
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

export default connect(mapState, { getFiles, sendGlobalError, showFile })(CloudStorage);