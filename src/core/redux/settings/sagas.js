import { all, takeEvery, put, delay, call, select, race, take, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import store from 'store';
import qs from 'qs';
import { history } from 'App';
import fetchRate from 'core/services/price';
import actions from './actions';

const getSettingsState = (state) => state.settings;

export function* CHANGE_SETTING({ payload: { setting, value } }) {
  yield store.set(`app.settings.${setting}`, value);
  yield put({
    type: 'settings/SET_STATE',
    payload: {
      [setting]: value,
    },
  });
}

export function* CHANGE_FIAT_CURRENCY(action) {
  const { payload } = action;

  const { value } = payload;

  let symbol;

  switch (value) {
    case 'eur':
      symbol = '€';
      break;

    case 'gbp':
      symbol = '£';
      break;

    case 'usd':
      symbol = '$';
      break;

    default: {
      break;
    }
  }

  if (value !== 'eth') {
    yield put({
      type: actions.SET_FIAT_CURRENCY,
      payload: {
        convertCryptoToFiat: true,
        fiatCurrency: value,
        fiatSymbol: symbol,
      },
    });
    yield put({ type: actions.CANCEL_UPDATE_RATE });
    yield put({ type: actions.RESTART_RATE_UPDATE });
  } else {
    yield put({
      type: actions.SWITCH_CONVERSION,
      payload: {
        convertCryptoToFiat: false,
      },
    });
  }
}

export function* UPDATE_ETH_RATE() {
  while (true) {
    const { fiatCurrency } = yield select(getSettingsState);

    const { ethereum } = yield call(fetchRate, fiatCurrency);

    let rate;

    switch (fiatCurrency) {
      case 'eur':
        rate = ethereum.eur;
        break;

      case 'usd':
        rate = ethereum.usd;
        break;

      case 'gbp':
        rate = ethereum.gbp;
        break;

      default: {
        break;
      }
    }

    if (rate) {
      yield put({
        type: actions.ETH_RATE_UPDATE,
        payload: {
          rate: Number(rate),
        },
      });
    }

    yield delay(30000);
  }
}

function* RATE_CONTROLLER() {
  yield race({
    task: UPDATE_ETH_RATE(),
    cancel: take(actions.CANCEL_UPDATE_RATE),
  });
}

// load settings from url on app load
function* changeSettings(search) {
  const query = qs.parse(search, { ignoreQueryPrefix: true });

  yield all(
    Object.keys(query).map((key) => {
      return put({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: key,
          value: query[key] === 'true',
        },
      });
    }),
  );
}

function onHistoryChangesChannel(h) {
  return eventChannel((emit) => {
    h.listen((params) => {
      const { search } = params;
      emit({ search });
    });

    return () => {
      // unsubscribe
    };
  });
}

function* watchHistoryChangeEvents() {
  const onHistoryChange = yield call(onHistoryChangesChannel, history);
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      const historyChangeEvent = yield take(onHistoryChange);
      if (historyChangeEvent.search) {
        yield changeSettings(historyChangeEvent.search);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function* isMobileView(load = false) {
  const currentState = global.window.innerWidth < 768;
  const prevState = store.get('app.settings.isMobileView');
  if (currentState !== prevState || load) {
    yield put({
      type: actions.CHANGE_SETTING,
      payload: {
        setting: 'isMobileView',
        value: currentState,
      },
    });
  }
}

function onWindowChangesChannel(w) {
  return eventChannel((emit) => {
    w.addEventListener('resize', () => {
      const resize = 'resize';
      emit({ resize });
    });

    return () => {
      // unsubscribe
    };
  });
}

function* watchWindowChanges() {
  const onWindowChange = yield call(onWindowChangesChannel, window);
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      const windowChangeEvent = yield take(onWindowChange);

      if (windowChangeEvent.resize) {
        yield isMobileView();
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export function* SETUP() {
  // load settings from url on app load
  yield changeSettings(history.location.search);

  yield fork(watchHistoryChangeEvents);

  // detect isMobileView setting on appload and window resize
  yield isMobileView(true);

  yield fork(watchWindowChanges);

  yield race({
    task: UPDATE_ETH_RATE(),
    cancel: take(actions.CANCEL_UPDATE_RATE),
  });
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING),
    SETUP(), // run once on app load to init listeners
    takeEvery(actions.RESTART_RATE_UPDATE, RATE_CONTROLLER),
    takeEvery(actions.CHANGE_FIAT_CURRENCY, CHANGE_FIAT_CURRENCY),
  ]);
}
