import axios from 'axios'

import {
  CLEAR_ERRORS, ON_POST_FAIL,
  GET_DA_HOME, HOME_LOADING, GET_PATIENT_DETAILS, GET_INVALID_MR, GET_ERRORS, GET_MR, GET_LVPEI_USERS
} from './types'




export const getDAHome = () => dispatch => {
dispatch(setLoading())
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
  }).catch(err =>{}
  )
}
export const getPatientDetails=(data) => dispatch => {
  dispatch(setLoading())
  axios.post('/api/diagAdmin/patientDetails', data)
    .then(res => {
      dispatch({
        type: GET_PATIENT_DETAILS,
        payload: res.data
      })
    }).catch(err =>{
    dispatch({
      type: GET_INVALID_MR,
      payload: err.response.data
    })}
  )
}
export const continueToUpload=(data) => dispatch => {
  axios.post('/api/diagAdmin/continueToUpload', data)
    .then(res => {
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


export const removeDiagUserAccess = (userData) => dispatch => {
  dispatch(clearErrors())
  axios.post('/api/diagAdmin/removeUserAccess', userData)
    .then(res => {
      window.location.href='/dashboard'
    }).catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  )
};

export const grantDiagUserAccess = (userData) => dispatch => {
  dispatch(clearErrors())
  axios.post('/api/diagAdmin/grantUserAccess', userData)
    .then(res => {
      window.location.href='/dashboard'
    }).catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  )
};


export const ControlDiagUsers = () => dispatch => {
  dispatch(setLoading())
  axios.get('/api/diagAdmin/currentDiagUsers').then(res => {
    dispatch({
      type:GET_LVPEI_USERS,
      payload: res.data
    })
  }).catch(err => {
    })
}

export const InActiveDiagUsers = () => dispatch => {
  dispatch(setLoading())
  axios.get('/api/diagAdmin/deAssignedDiagUsers').then(res => {
    dispatch({
      type:GET_LVPEI_USERS,
      payload: res.data
    })
  }).catch(err => {
    })
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
