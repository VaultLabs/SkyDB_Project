const actions = {
  SET_STATE: 'settings/SET_STATE',
  CHANGE_SETTING: 'settings/CHANGE_SETTING',
  ETH_RATE_UPDATE: 'settings/ETH_RATE_UPDATE',
  CHANGE_FIAT_CURRENCY: 'settings/CHANGE_FIAT_CURRENCY',
  SET_FIAT_CURRENCY: 'settings/SET_FIAT_CURRENCY',
  CANCEL_UPDATE_RATE: 'settings/CANCEL_UPDATE_RATE',
  RESTART_RATE_UPDATE: 'settings/RESTART_RATE_UPDATE',
  SWITCH_CONVERSION: 'settings/SWITCH_CONVERSION',
  SET_INITIAL_MAP_LOAD: 'settings/SET_INITIAL_MAP_LOAD',
  SET_COLLAPSED_SIDER: 'settings/SET_COLLAPSED_SIDER',
};

export default actions;

export const closeSettings = () => {
  return {
    type: actions.CHANGE_SETTING,
    payload: {
      setting: 'isSettingsOpen',
      value: false,
    },
  };
};

export const changeSetting = (setting, value) => {
  return {
    type: actions.CHANGE_SETTING,
    payload: {
      setting,
      value,
    },
  };
};

export const setInitialMapLoad = (initialMapLoad) => {
  return {
    type: actions.SET_INITIAL_MAP_LOAD,
    payload: {
      initialMapLoad,
    },
  };
};

export const setSiderCollapse = (collapsed, siderWidth) => {
  return {
    type: actions.SET_COLLAPSED_SIDER,
    payload: {
      collapsed,
      siderWidth,
    },
  };
};

export const changeCurrency = (value) => {
  return {
    type: actions.CHANGE_FIAT_CURRENCY,
    payload: {
      value,
    },
  };
};
