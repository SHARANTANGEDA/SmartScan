import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorReducer from './errorReducer'
import homeReducer from './homeReducer'
import fileReducer from './fileReducer'
import profileReducer from './profileReducer'


export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  home: homeReducer,
  folder: fileReducer,
  profile: profileReducer
})