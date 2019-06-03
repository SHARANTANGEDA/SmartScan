import axios from 'axios'

import {  GET_ERRORS, GET_MY_PROFILE, PROFILE_LOADING } from './types'

// Get current profile
export const getMyAccount = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/users/myAccount')
    .then(res =>
      dispatch({
        type:   GET_MY_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_MY_PROFILE,
        payload: {}
      })
    );
};

// Add education
export const updateProfile = (data, history) => dispatch => {
  console.log("Update Profile is running")
  axios
    .post('/api/users/myAccount/change', data)
    .then(res => {
      console.log({res})
      window.location.reload();
      history.push('/myAccount')
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const changePassword = (data, history) => dispatch => {
  console.log("Change Password is running")
  axios
    .post('/api/users/changePassword', data)
    .then(res => {
      console.log({change:res})
      history.push('/myAccount')
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear profile
// export const clearCurrentProfile = () => {
//   return {
//     type: CLEAR_CURRENT_PROFILE
//   };
// };
