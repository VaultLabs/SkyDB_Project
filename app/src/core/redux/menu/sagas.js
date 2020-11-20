import { all, put, call, takeEvery } from 'redux-saga/effects';
import getTopMenuData from 'core/services/menu';
import { FETCH_MENU, SET_MENU_STATE } from './actions';

export function* GET_DATA() {
  const menuTopData = yield call(getTopMenuData);
  yield put({
    type: SET_MENU_STATE,
    payload: {
      menuTopData,
    },
  });
}

export default function* rootSaga() {
  yield all([
    takeEvery(FETCH_MENU, GET_DATA), // run once on app load to fetch menu data
  ]);
}
