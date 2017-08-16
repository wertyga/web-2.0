import { GLOBAL_ERROR } from '../actions/actions';


export default function globalErrors(state = '', action = {}) {
    switch(action.type) {

        case GLOBAL_ERROR:
            return action.error


        default: return state;
    }
};