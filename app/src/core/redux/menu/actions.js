export const SET_MENU_STATE = 'menu/SET_STATE';
export const GET_MENU_DATA = 'menu/GET_DATA';
export const FETCH_MENU = 'menu/FETCH';

export const fetchMenu = () => {
  return {
    type: FETCH_MENU,
  };
};
