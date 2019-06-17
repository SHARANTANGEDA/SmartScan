import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorReducer from './errorReducer'
import homeReducer from './homeReducer'
import fileReducer from './fileReducer'
import searchReducer from './searchReducer'


export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  home: homeReducer,
  folder: fileReducer,
  search: searchReducer
})