import {
  GET_SA_HOME,
  GET_DA_HOME,
  HOME_LOADING,
  GET_PATIENT_DETAILS,
  GET_INVALID_MR,
  GET_MR,
  GET_INACTIVE,
  GET_ACTIVE,
  VIEW_LOADING
} from '../actions/types'

const initialState = {
  active: null,
  loading: true,
  loading2: true,
  inActive: null,
};

export default function(state = initialState, action) {
  console.log({'HomeReducer':action.payload});
  switch (action.type) {
    case VIEW_LOADING:
      return {
        ...state,
        loading: true,
        loading2:true,
        active: null,
        inActive: null,
      }

    case GET_ACTIVE:
      return {
        ...state,
        active: action.payload,
        loading: false
      }
    case GET_INACTIVE:
      return {
        ...state,
        inActive: action.payload,
        loading2: false
      }

    default:
      return state;

  }
}
