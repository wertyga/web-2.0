import { SET_FILES, DELETE_FILE, ADD_FILE } from '../actions/actions';

import findIndex from 'lodash/findIndex';

export default function files(state = [], action = {}) {
    switch(action.type) {

        case SET_FILES:
            return action.files

        case ADD_FILE:
            let index = findIndex(state, item => item.filename === action.file.filename);
            if(index !== -1) {
                state[index] = action.file
            } else {
                state.push(action.file)
            }



        case DELETE_FILE:
            return state.filter(file => file.filename !== action.filename)

        default: return state;
    }
};