import axios from 'axios'

import {
  CLEAR_ERRORS, FOLDER_LOADING,
  GET_COURSES,
  GET_DETAILS,
  GET_FILES,
  GET_FILES_SINGLE_FOLDER,
  GET_NO_COURSE, LOADING,
  NO_FILES,
  NO_FILES_IN_FOLDER
} from './types'

const FileDownload = require('js-file-download');



export const getDetails = (userData) => dispatch => {
  axios.post('/api/users/enterName', userData)
    .then(res => {
      dispatch({
        type: GET_DETAILS,
        payload: res.data
      })
      window.location.href='/uploadMultipleFiles'
    }).catch(err =>
    dispatch({
      type: GET_NO_COURSE,
      payload: null
    })
  )
};

export const downloadFile = (id) => dispatch => {
  axios.get(`/api/upload/downloadFile/${id}`,{responseType: 'blob'}).then(res => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    console.log(url)
    link.href = url;
    link.setAttribute('download', id+'.dcm');
    document.body.appendChild(link);
    link.click();
    // console.log('download in progress')

    // dispatch({
    //   type: GET_IMAGE,
    //   payload: res.data
    // })
  }).catch(err =>
    dispatch({
      type: NO_FILES,
      payload: err.data
    })
  );
}

export const getFiles = () => dispatch => {
  axios.get('/api/upload/files').then(res => {
    dispatch({
      type: GET_FILES,
      payload: res.data
    })
  }).catch(err =>
      dispatch({
        type: NO_FILES,
        payload: err.data
      })
  );
};

export const getFilesByFolder = (id) => dispatch => {
  setLoading()
  axios.get(`/api/upload/files/${id}`).then(res => {
    dispatch({
      type: GET_FILES_SINGLE_FOLDER,
      payload: res.data
    })
  }).catch(err =>
    dispatch({
      type: NO_FILES_IN_FOLDER,
      payload: err.data
    })
  );
};

export const setLoading = () => {
  return {
    type: FOLDER_LOADING
  };
};
// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
