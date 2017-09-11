import axios from 'axios';

export const SET_FILES = 'SET_FILES';
export const GLOBAL_ERROR = 'GLOBAL_ERROR';
export const DELETE_FILE = 'DELETE_FILE';
export const ADD_FILES = 'ADD_FILES';
export const RENAME_FILE = 'RENAME_FILE';

export function checkFile(opt) {
    return dispatch => {
        return axios.post('/api/check-file', { ...opt })
    }
};

export function sendFiles(files) {
    return dispatch => {
        return axios(Object.assign(files, { method: 'post', url: '/api/load-files'})).then(res => dispatch(addFile(res.data.files)))
    }
};
function addFile(files) {
    return {
        type: ADD_FILES,
        files
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

export function changeFileName(props) {
    return dispatch => {
        return axios.post('/api/change-file', { ...props })
            .then(res => dispatch(renameFile(res.data, props.id)))
            .catch(err => dispatch(globalError(err.response ? err.response.data : err.message)))
    }
};
function renameFile(newFile, lastName) {
    return {
        type: RENAME_FILE,
        file: {
            newFile,
            lastName
        }
    }
}

export function download(filename, user, type) {
    window.location.href = `/download?filename=${filename}&user=${user}&type=${type}`
};