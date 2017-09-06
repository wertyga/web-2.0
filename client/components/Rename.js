import '../styles/Rename.sass';

const Rename = createReactClass({

    getInitialState() {
        return {
            value: ''
        }
    },

    onChange(e) {
        this.setState({
            value: e.target.value
        });
    },
    
    rename(e) {
        if(e.keyCode === 13) {
            //enter key
            this.props.changeFileName(this.state.value);
        };
        if(e.keyCode === 27) {
            // esc key
            this.props.cancelRenameFile();
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.props.show !== prevProps.show) {
            if(this.props.show) {
                this.refs.input.focus();
                this.setState({
                    value: this.props.value
                });
                this.refs.input.addEventListener('keydown', this.rename);
            }
        };
    },

    render() {
        return (
            <div className='Rename'>
                <input
                    type="text"
                    ref="input"
                    value={this.state.value}
                    onChange={this.onChange}
                    onClick={e => e.stopPropagation()}
                />
            </div>
        );
    }
});

export default Rename;