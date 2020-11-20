import { SET_MENU_STATE } from './actions';

const initialState = {
  menuTopData: [],
};

export default function menuReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MENU_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
