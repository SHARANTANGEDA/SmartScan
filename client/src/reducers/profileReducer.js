import {
  GET_MY_PROFILE,
  PROFILE_LOADING
} from '../actions/types'

const initialState = {
  profile: null,
  profiles: [],
  loading: true
};

export default function(state = initialState, action) {
  console.log({'ProfileReducer':action.payload});

  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };

    case GET_MY_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
