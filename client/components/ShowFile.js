import '../styles/ShowFile.sass';

const ShowFile = createReactClass({
    
    render() {
        return (
            <div className="ShowFile" style={{ overflow: this.props.type !== 'text' ? 'initial' : 'scroll' }}>
                {this.props.type === 'image' ?
                    <img src={this.props.file} alt={this.props.filename}/> :
                    <p>{this.props.file}</p>
                }

                {this.props.description &&
                    <div className="description">
                        <p><strong>Name: </strong>{this.props.description.filename}</p>
                        <p><strong>Type: </strong>{this.props.type}</p>
                        <p><strong>Size: </strong>{this.props.description.length / 1000000} MB</p>
                        <p><strong>Last update: </strong>{this.props.description.uploadDate.split('T')[0]}</p>
                    </div>
                }
            </div>
        );
    }
});

export default ShowFile;