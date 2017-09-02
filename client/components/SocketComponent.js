import io from 'socket.io-client';

const Socket = createReactClass({

    componentDidMount() {
        this.socket = io('/');

        
    },

    render() {
        return (
            <div className="Socket"></div>
        );
    }
});

export default Socket;