import { combineReducers } from 'redux';
import files from './main';
import globalError from './globalError';

export default combineReducers({
    files,
    globalError
});