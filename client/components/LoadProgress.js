import '../styles/LoadProgress.sass';

const LoadProgress = createReactClass({

    getInitialState() {
        return {
            width: this.props.width
        }
    },
    
    render() {
        return (
            <div className="LoadProgress">
                <div className="col-md-12">
                    <div className="load">
                        <div className="progress" style={{ width: (this.props.width || 0) + '%' }}></div>
                    </div>
                </div>
            </div>
        );
    }
});

export default LoadProgress;