import {
  GET_SA_HOME, GET_DA_HOME, HOME_LOADING, GET_PATIENT_DETAILS, GET_INVALID_MR, GET_MR
} from '../actions/types'

const initialState = {
  home: null,
  loading: true,
  loading2: true,
  loading3: true,
  patientData: null,
  invalid: false
};

export default function(state = initialState, action) {
  console.log({'HomeReducer':action.payload});
  switch (action.type) {
    case HOME_LOADING:
      return {
        ...state,
        loading: true,
        loading2:true,
        loading3: true,
        home: null,
        patientData: null,
        invalid: false
      }
    case GET_MR:
      return {
        ...state,
        mid: action.payload,
        loading3: false
      }
    case GET_INVALID_MR:
      return {
        ...state,
        patientData: action.payload,
        loading2: false,
        invalid: true
      }
    case GET_PATIENT_DETAILS:
      return {
        ...state,
        patientData: action.payload,
        loading2: false
      }
    case GET_SA_HOME:
      return {
        ...state,
        home: action.payload,
        loading: false
      }
    case GET_DA_HOME:
      return {
        ...state,
        home: action.payload,
        loading: false
      }

    default:
      return state;

  }
}
