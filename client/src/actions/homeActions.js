import axios from 'axios'

import {
   CLEAR_ERRORS, GET_DETAILS, GET_NO_COURSE
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
      type: GET_NO_COURSE,
      payload: null
    })
  )
};


// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
