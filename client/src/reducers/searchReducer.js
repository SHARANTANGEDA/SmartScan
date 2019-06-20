import {
 GET_SEARCH_RESULTS, SEARCH_LOADING,
} from '../actions/types'

const initialState = {
  results: null,
  loading: true
};

export default function(state = initialState, action) {
  console.log({'Search Reducer':action.payload});
  switch (action.type) {
    case SEARCH_LOADING:
      console.log("IN File Reducer loading")
      return {
        ...state,
        loading: true,
      }
    case GET_SEARCH_RESULTS:
      return {
        ...state,
        results: action.payload,
        loading: false,

      };
    default:
      return state;

  }
}
