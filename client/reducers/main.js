import { SET_FILE } from '../actions/actions';


export default function files(state = [], action = {}) {
    switch(action.type) {

        case SET_FILE:
            if(state.length < 1) {
                return action.file
            } else {
                state = state.filter(file => file.filename !== action.file.filename);
                return [...state, action.file];
            }

        default: return state;
    }
};