import axios from 'axios';

export const SET_FILES = 'SET_FILES';
export const GLOBAL_ERROR = 'GLOBAL_ERROR';
export const DELETE_FILE = 'DELETE_FILE';
export const ADD_FILE = 'ADD_FILE';

export function checkFile(opt) {
    return dispatch => {
        return axios.post('/api/check-file', { ...opt })
    }
};

export function sendFiles(file) {
    return dispatch => {
        return axios(Object.assign(file, { method: 'post', url: '/api/load-files'})).then(res => dispatch(addFile(res.data)))
    }
};
function addFile(file) {
    return {
        type: ADD_FILE,
        file
    }
};

function dispatchFiles(files) {
    return {
        type: SET_FILES,
        files
    }
};

export function getFiles(user) {
    return dispatch => {
        return axios.post('/api/fetch-files', { user }).then(res => dispatch(dispatchFiles(res.data.files)))
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