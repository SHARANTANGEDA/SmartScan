import {
  GET_FILES,
  FOLDER_LOADING,
  NO_FILES,
  GET_FILES_SINGLE_FOLDER,
  NO_FILES_IN_FOLDER, GET_PATIENTS_HOME, GET_ACCOUNT_DETAILS, ACCOUNT_LOADING,
} from '../actions/types'

const initialState = {
  loading: true,
  details: null
};

export default function(state = initialState, action) {
  // console.log({'File Reducer':action.payload});
  switch (action.type) {
    case ACCOUNT_LOADING:
      return {
        ...state,
        loading: true,
        details: null
      }
    case GET_ACCOUNT_DETAILS:
      return {
        ...state,
        details: action.payload,
        loading: false,
      };
    default:
      return state;

  }
}
