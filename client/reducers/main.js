import { SET_FILE, DELETE_FILE } from '../actions/actions';


export default function files(state = [], action = {}) {
    switch(action.type) {

        case SET_FILE:
            return state.concat(action.file);

        case DELETE_FILE:
            return state.filter(file => file.filename !== action.filename)

        default: return state;
    }
};