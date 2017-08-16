import axios from 'axios';

export const SET_FILE = 'SET_FILE';
export const GLOBAL_ERROR = 'GLOBAL_ERROR';

export function checkFile(opt) {
    return dispatch => {
        return axios.post('/api/check-file', { ...opt })
    }
};

export function sendFiles(file) {
    return dispatch => {
        return axios(Object.assign(file, { method: 'post', url: '/api/load-files'})).then(res => dispatch(dispatchFiles(res.data)))
    }
};
function dispatchFiles(file) {
    return {
        type: SET_FILE,
        file
    }
};

export function getFiles() {
    return dispatch => {
        return axios.post('/api/fetch-files').then(res => dispatch(dispatchFiles(res.data.files)))
    };
};

export function sendGlobalError(error) {
    return dispatch => {
        return dispatch({ type: GLOBAL_ERROR, error })
    }
}

export function showFile(opt) {
    return dispatch => {
        return axios.post('/api/show-file', opt)
    }
};