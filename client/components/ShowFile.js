import '../styles/ShowFile.sass';

const ShowFile = createReactClass({
    render() {
        return (
            <div className="ShowFile">
                {this.props.type === 'image' && <img src={this.props.file} alt={this.props.filename}/>}
                {this.props.type === 'text' && <p>{this.props.file}</p>}
                {this.props.type === 'video' &&
                    <video controls autoPlay>
                        <source src={this.props.file}/>
                    </video>
                }
            </div>
        );
    }
});

export default ShowFile;