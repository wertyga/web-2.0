import axios from 'axios';

export async function sendFile(file) {
    let formData = await new FormData();
    await formData.append(file.name, file);
    console.log(formData)
    return dispatch => {
        return axios.post('/api/get-files', formData)
    }

};