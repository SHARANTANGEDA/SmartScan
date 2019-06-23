import axios from 'axios'

import {
  CLEAR_ERRORS, ON_POST_FAIL,
  GET_DA_HOME, HOME_LOADING, GET_PATIENT_DETAILS, GET_INVALID_MR, GET_ERRORS, GET_MR
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
export  const deleteResidual=(id) => dispatch => {
  axios.post(`/api/diagAdmin/onDiscard`,id).then(res => {
    window.location.href='/dashboard'
  }).catch(err =>
    console.log('error in deleting residual')
  )
}
export const getPatientDetails=(data) => dispatch => {
  axios.post('/api/diagAdmin/patientDetails', data)
    .then(res => {
      dispatch({
        type: GET_PATIENT_DETAILS,
        payload: res.data
      })
    }).catch(err =>{
    console.log(err)
    dispatch({
      type: GET_INVALID_MR,
      payload: err.response.data
    })}
  )
}
export const continueToUpload=(data) => dispatch => {
  axios.post('/api/diagAdmin/continueToUpload', data)
    .then(res => {
      console.log('created User')
      dispatch({
        type: GET_MR,
        payload: res.data
      })    }).catch(err =>
    dispatch({
      type: GET_INVALID_MR,
      payload: err.response.data
    })
  )
}
export const createNewMembers=(data) => dispatch => {
  dispatch(clearErrors())
  axios.post('/api/diagAdmin/addMembers', data)
    .then(res => {
      window.location.href='/dashboard'
    }).catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data

    })
  )
}
export const deleteDiagUser=(data) => dispatch => {
  dispatch(clearErrors())
  axios.post('/api/diagAdmin/deleteMember', data)
    .then(res => {
      window.location.href='/dashboard'
    }).catch(err =>
    dispatch({
      type: GET_ERRORS,
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
