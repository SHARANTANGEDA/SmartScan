import {GET_SA_HOME
} from '../actions/types'

const initialState = {
  home: null,
  loading: true
};

export default function(state = initialState, action) {
  console.log({'HomeReducer':action.payload});
  switch (action.type) {
    case GET_SA_HOME:
      return {
        ...state,
        home: action.payload,
        loading: false
      }

    default:
      return state;

  }
}
