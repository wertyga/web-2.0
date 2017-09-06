import '../styles/DropdownMenu.sass';

const DropdownMenu = createReactClass({
    
    render() {
        return (
            <div className="DropdownMenu" style={{ top: this.props.y, left: this.props.x }}>
                <ul>
                    <li onClick={this.props.deleteFile} className="dropMenu">Delete file</li>
                    <li onClick={this.props.renameFile} className="dropMenu">Rename file</li>
                    <li onClick={this.props.downloadFile} className="dropMenu">Download file</li>
                </ul>
            </div>
        );
    }
});



export default DropdownMenu;