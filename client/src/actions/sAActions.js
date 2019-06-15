import axios from 'axios'

import {
  CLEAR_ERRORS, FOLDER_LOADING,
  GET_ERRORS
} from './types'


export const addDiagnostics = (userData) => dispatch => {
  clearErrors()
  axios.post('/api/superAdmin/addDiagnostic', userData)
    .then(res => {
      window.location.href='/dashboard'
    }).catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  )
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
