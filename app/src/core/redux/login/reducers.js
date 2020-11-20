import { actions } from './actions';

const initialState = {
  authorized: false,
  end2endLoadingIndicator: false,
  initializingWeb3: false,
  selectedAccount: null,
  provider: null,
  web3Modal: null,
  web3: null,
  signingOut: false,
  isLoggedIn: false,
};

export default function loginReducer(state = initialState, action) {
  let reduced;
  switch (action.type) {
    case actions.CHANGE_AUTHORIZATION:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.INITIALIZING_WEB3:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.SET_WEB3:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.WEB3_ERROR:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.SIGNING_OUT:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    default:
      reduced = state;
  }
  return reduced;
}
