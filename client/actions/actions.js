import axios from 'axios';

export const SET_FILE = 'SET_FILE';
export const GLOBAL_ERROR = 'GLOBAL_ERROR';
export const DELETE_FILE = 'DELETE_FILE';

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
        return dispatch(globalError(error))
    }
}
function globalError(error) {
    return {
        type: GLOBAL_ERROR,
        error
    }
};

export function showFile(opt) {
    return dispatch => {
        return axios.post('/api/show-file', opt)
    }
};

export function deleteFile(file) {
    return dispatch => {
        return axios.post('/api/delete-file', { id: file.id})
            .then(res => dispatch(fileDelete(file.filename)))
            .catch(err => dispatch(globalError(err.response.data.error)))
    }
};
function fileDelete(filename) {
    return {
        type: DELETE_FILE,
        filename
    }
};