import io from 'socket.io-client';
import axios from 'axios';

export default function(self) {

    let socket = io('/');

    return {
        onSubmit() {
            socket.emit('submit', {data: 'submit'})
        }
    }
}