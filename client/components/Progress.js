
import '../styles/Progress.sass';


const Progress  = createReactClass({
    render() {

        let style = {
            progressBar: {
                width: this.props.width + '%'
            },
            mainElem: {
                opacity: this.props.width > 0 ? 1 : 0,
            }
        };

        return(
            <div className="Progress" style={style.mainElem}>
                <span onClick={this.props.cancelClick}>X</span>
                <div className="loaded">
                    <div className="progressBar" style={style.progressBar}></div>
                </div>
                <p>{this.props.loaded} / {this.props.total}</p>
            </div>
        );
    }
});

export default Progress;