import axios from 'axios'

import {  GET_ERRORS } from './types'



export const changePassword = (data, history) => dispatch => {
  console.log("Change Password is running")
  axios
    .post('/api/users/changePassword', data)
    .then(res => {
      console.log({change:res})
      history.push('/dashboard')
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Clear profile
// export const clearCurrentProfile = () => {
//   return {
//     type: CLEAR_CURRENT_PROFILE
//   };
// };
