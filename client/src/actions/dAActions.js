import axios from 'axios'

import {
  CLEAR_ERRORS, FOLDER_LOADING,
  ON_POST_FAIL,
  NO_FILES,
  GET_DA_HOME, HOME_LOADING, GET_DETAILS, GET_PATIENT_DETAILS, GET_INVALID_MR
} from './types'




export const getDAHome = () => dispatch => {
setLoading()
  axios.get('/api/diagAdmin/home').then(res => {
    dispatch({
      type: GET_DA_HOME,
      payload: res.data
    })
  }).catch(err =>
    dispatch({
      type: ON_POST_FAIL,
      payload:null
    })
  );
};

export const getPatientDetails=(data) => dispatch => {
  axios.post('/api/diagAdmin/patientDetails', data)
    .then(res => {
      dispatch({
        type: GET_PATIENT_DETAILS,
        payload: res.data
      })
    }).catch(err =>
    dispatch({
      type: GET_INVALID_MR,
      payload: err.response.data
    })
  )
}

export const setLoading = () => {
  return {
    type: HOME_LOADING
  };
};
// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
