import axios from 'axios'

import {
  CLEAR_ERRORS,
  FOLDER_LOADING,
  GET_ACTIVE, GET_DIAG_USER_HOME,
  GET_FILES,
  GET_FILES_SINGLE_FOLDER, GET_NAME_RESULTS,
  GET_PATIENTS_HOME,
  GET_SA_HOME, GET_SEARCH_ERRORS,
  GET_SEARCH_RESULTS,
  HOME_LOADING,
  NO_FILES,
  NO_FILES_IN_FOLDER,
  ON_POST_FAIL,
  SEARCH_LOADING,
  VIEW_LOADING
} from './types'

// export const getDetails = (userData) => dispatch => {
//   homeLoading()
//   axios.post('/api/users/enterName', userData)
//     .then(res => {
//       dispatch({
//         type: GET_DETAILS,
//         payload: res.data
//       })
//       window.location.href='/uploadMultipleFiles'
//     }).catch(err =>
//     dispatch({
//       type: ON_POST_FAIL,
//       payload: null
//     })
//   )
// };

export const getSADetails = () => dispatch => {
  dispatch(homeLoading())
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
}
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

export const deletePatient = (id) => dispatch => {
  axios.get(`/api/upload/deletePatient/${id}`).then(res => {
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
  axios.get(`/api/upload/downloadFile/${id}`, { responseType: 'blob' }).then(res => {
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'octet/stream' }))
    const link = document.createElement('a')
    console.log(url)
    link.href = url
    link.setAttribute('download', id.substr(id.lastIndexOf(';') + 1, id.length))
    document.body.appendChild(link)
    link.click()
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
  )
}

export const downloadFolder = (id) => dispatch => {
  console.log('In download folder')
  axios.get(`/api/upload/downloadFolder/${id}`, { responseType: 'blob' }).then(res => {
    console.log(res)
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    console.log(url)
    link.href = url
    link.setAttribute('download', id + '.zip')
    document.body.appendChild(link)
    link.click()
    window.location.href = '/dashboard'

  }).catch(err =>
    dispatch({
      type: NO_FILES,
      payload: err.data
    })
  )
}

export const getHomeFolders = (id) => dispatch => {
  dispatch(setLoading())
  dispatch(homeLoading())
  axios.get(`/api/upload/folders/${id}`).then(res => {
    dispatch({
      type: GET_FILES,
      payload: res.data
    })
  }).catch(err =>
    dispatch({
      type: NO_FILES,
      payload: err.data
    })
  )
}

export const getDiagUserHome=() => dispatch => {
  dispatch(homeLoading())
  axios.get('/api/diagUser/home',)
    .then(res => {
      dispatch({
        type: GET_DIAG_USER_HOME,
        payload: res.data
      })
    }).catch(err =>
   console.log(err)
  )
}

export const getSearchResults = (data) => dispatch => {
  dispatch(setSearchLoading())
  dispatch(homeLoading())
  axios.post(`/api/users/search`, data).then(res => {
    dispatch({
      type: GET_SEARCH_RESULTS,
      payload: res.data
    })
  }).catch(err =>
    dispatch({
      type: NO_FILES,
      payload: err.data
    })
  )
}
export const getNameResults = (data) => dispatch => {
  dispatch(setSearchLoading())
  dispatch(homeLoading())
  axios.get(`/api/users/searchName/${data}`).then(res => {
    console.log({result: res})
    dispatch({
      type: GET_NAME_RESULTS,
      payload: res.data
    })
  }).catch(err =>
    console.log({sErr: err})
    // dispatch({
    //   type: GET_SEARCH_ERRORS,
    //   payload: err.data
    // })
  )
}
export const getAllPatients = () => dispatch => {
  dispatch(setLoading())
  dispatch(homeLoading())
  axios.get('/api/upload/patientsFolders').then(res => {
    dispatch({
      type: GET_PATIENTS_HOME,
      payload: res.data
    })
  }).catch(err =>
    dispatch({
      type: NO_FILES,
      payload: err.data
    })
  )
}
export const downloadSelectedFiles = (id) => dispatch => {
  console.log('In download folder')
  axios.post(`/api/upload/downloadSelected`,(id), { responseType: 'blob' }).then(res => {
    console.log(res)
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    console.log(url)
    link.href = url
    link.setAttribute('download',
      id.selected[0].substring(id.selected[0].indexOf(';')+1, id.selected[0].lastIndexOf(';')) + '.zip')
    document.body.appendChild(link)
    link.click()
  }).catch(err =>
    dispatch({
      type: NO_FILES,
      payload: err.data
    })
  )
}
export const getFilesByFolder = (id) => dispatch => {
  dispatch(setLoading())
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
  )
}

export const displayDicom = (id) => dispatch => {
  dispatch(viewLoading())

  axios.post('/api/upload/displayDicom', id, {responseType: 'arraybuffer'}).then(res => {
    console.log(res)
    dispatch({
      type: GET_ACTIVE,
      payload: res
    })
  }).catch(err => {
      dispatch({
        type: ON_POST_FAIL,
        payload: null
      })
    }
  )
}
export const setLoading = () => {
  return {
    type: FOLDER_LOADING
  }
}

export const viewLoading = () => {
  return {
    type: VIEW_LOADING
  }
}
export const homeLoading = () => {
  return {
    type: HOME_LOADING
  }
}

export const setSearchLoading = () => {
  return {
    type: SEARCH_LOADING
  }
}

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}
