import { all } from 'redux-saga/effects';
import contracts from 'core/redux/contracts/sagas';
import login from 'core/redux/login/sagas';
import menu from 'core/redux/menu/sagas';
import settings from 'core/redux/settings/sagas';
import spatialAssets from 'core/redux/spatial-assets/sagas';

export default function* rootSaga() {
  yield all([contracts(), login(), menu(), settings(), spatialAssets()]);
}
