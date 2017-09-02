import '../styles/DropdownMenu.sass';

const DropdownMenu = createReactClass({
    
    render() {
        return (
            <div className="DropdownMenu" style={{ top: this.props.y, left: this.props.x }}>
                <ul>
                    <li onClick={this.props.deleteFile}>Delete file</li>
                    <li onClick={this.renameFile}>Rename file</li>
                </ul>
            </div>
        );
    }
});



export default DropdownMenu;