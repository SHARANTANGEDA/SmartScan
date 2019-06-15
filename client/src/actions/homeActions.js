import axios from 'axios'

import {
  CLEAR_ERRORS, FOLDER_LOADING,
  GET_DETAILS,
  GET_FILES,
  GET_FILES_SINGLE_FOLDER,
  ON_POST_FAIL,
  NO_FILES,
  NO_FILES_IN_FOLDER, GET_SA_HOME
} from './types'


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
      type: ON_POST_FAIL,
      payload: null
    })
  )
};


export const getSADetails = () => dispatch => {
  dispatch(setLoading());
  axios.get('/api/superAdmin/home',)
    .then(res => {
      dispatch({
        type: GET_SA_HOME,
        payload: res.data
      })
    }).catch(err =>
    dispatch({
      type: ON_POST_FAIL,
      payload: null
    })
  )
};
export const deleteFile = (id) => dispatch => {
  axios.get(`/api/upload/deleteFile/${id}`).then(res => {
    console.log(res)
    window.location.reload()
  }).catch(err =>
    dispatch({
      type: NO_FILES,
      payload: err.data
    })
  )
}

export const deleteFolder = (id) => dispatch => {
  axios.get(`/api/upload/deleteFolder/${id}`).then(res => {
    console.log(res)
    window.location.reload()
  }).catch(err =>
    dispatch({
      type: NO_FILES,
      payload: err.data
    })
  )
}

// export const downloadFile = (id)=> async dispatch => {
//   axios.get(`/api/upload/downloadFile/${id}`,{responseType: 'blob'}).then(res => {
//     saveAs(new Blob([res.data],{type: "octet/stream"}),id)
//   }).catch(err =>
//     dispatch({
//       type: NO_FILES,
//       payload: err.data
//     })
//   );
// }
export const downloadFile = (id) => dispatch => {
  axios.get(`/api/upload/downloadFile/${id}`,{responseType: 'blob'}).then(res => {
    const url = window.URL.createObjectURL(new Blob([res.data],{type: "octet/stream"}));
    const link = document.createElement('a');
    console.log(url)
    link.href = url;
    link.setAttribute('download', id);
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

export const downloadFolder  = (id) => dispatch => {
  console.log('In download folder')
  axios.get(`/api/upload/downloadFolder/${id}`,{responseType: 'blob'}).then(res => {
    console.log(res)
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    console.log(url)
    link.href = url;
    link.setAttribute('download', id+'.zip');
    document.body.appendChild(link);
    link.click();
    window.location.href='/dashboard';

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
