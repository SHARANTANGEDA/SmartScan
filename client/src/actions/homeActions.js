import axios from 'axios'

import {
  APPLY_TA, CLEAR_ERRORS, GET_COURSES, GET_DETAILS, GET_ERRORS, GET_NO_COURSE
} from './types'
import { setLoading } from './hodActions'


export const uploadFiles = (fileArray) => dispatch => {
  axios.post('/api/upload/upload', fileArray)
    .then(res => {
      dispatch({
        type: GET_DETAILS,
        payload: res.data
      })
      window.location.href='/dashboard'

    }).catch(err =>
    dispatch({
      type: GET_NO_COURSE,
      payload: null
    })
  )
};

export const getDetails = (userData) => dispatch => {
  axios.post('/api/users/enterName', userData)
    .then(res => {
      dispatch({
        type: GET_DETAILS,
        payload: res.data
      })
      console.log('Page refresh1')
      window.location.href='/uploadFiles'
      console.log('Page refresh2')
    }).catch(err =>
    dispatch({
      type: GET_NO_COURSE,
      payload: null
    })
  )
};

// Add Post
export const applyTA = courseCode => dispatch => {
  dispatch(clearErrors());
  axios
    .post('/api/users/applyForTA', courseCode)
    .then(res =>
      dispatch({
        type: APPLY_TA,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Get Questions for home
export const getCourseCodes = () => dispatch => {
  dispatch(setLoading());
  axios
    .get('/api/users/getAllCourses')
    .then(res => {
        dispatch({
          type: GET_COURSES,
          payload: res.data
        })
      }
    )
    .catch(err => {
        console.log("ERROR in Getting Courses")
        dispatch({
          type: GET_NO_COURSE,
          payload: null
        })
      }

    );
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
