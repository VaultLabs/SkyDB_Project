export const actions = {
  CHANGE_AUTHORIZATION: 'login/authorization-changed',
  SET_ACCOUNT: 'login/account-set',
  INIT_WEB3: 'login/init-web3',
  INITIALIZING_WEB3: 'login/initializing-web3',
  WEB3_ERROR: 'login/web3-error',
  SET_WEB3: 'login/web3-set',
  LOGIN: 'login/LOGIN',
  LOGOUT: 'login/LOGOUT',
  SIGNING_OUT: 'login/signing-out',
  LOGIN_SIGNOUT: 'login/signed-out',
  CANCEL_WATCH_INJECTED_PROVIDER: 'login/stop-watching-injected-provider',
  CHECK_ROLES: 'login/check-roles',
  CHECKING_ROLES: 'login/checking-roles',
  ROLES_CHECKED: 'login/roles-checked',
  REGISTRATION_SUCCEEDED: 'login/registration-succeeded',
  STOP_CHANNEL_FORK: 'login/stop-channel-fork',
};

export const changeAuthorization = () => {
  return {
    type: actions.CHANGE_AUTHORIZATION,
    payload: {
      authorized: true,
    },
  };
};

export const initWeb3 = () => {
  return {
    type: actions.INIT_WEB3,
  };
};

export const checkRoles = () => {
  return {
    type: actions.CHECK_ROLES,
  };
};

export const logout = () => {
  return {
    type: actions.LOGOUT,
  };
};
