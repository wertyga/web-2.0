import { SET_FILES, DELETE_FILE, ADD_FILES, RENAME_FILE } from '../actions/actions';

import findIndex from 'lodash/findIndex';

export default function files(state = [], action = {}) {
    switch(action.type) {

        case RENAME_FILE:
                return state.map(file => {
                    if(file.filename ===  action.file.lastName) {
                        return action.file.newFile;
                    } else {
                        return file;
                    }
                });

        case SET_FILES:
            return action.files;


        case ADD_FILES:
            for(let i = 0; i < action.files.length; i++) {
                let index = findIndex(state, item => item.filename === action.files[i].filename);
                if(index !== -1) {
                    state[index] = action.files[i]
                } else {
                    state.push(action.files[i])
                }
            };


        case DELETE_FILE:
            return state.filter(file => file.filename !== action.filename);



        default: return state;
    }
};