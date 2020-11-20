import { all, takeEvery, put, call, take, fork, select, race } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { push } from 'connected-react-router';
import { notification } from 'antd';
import Web3 from 'web3';
import getWeb3Modal from 'core/services/initWeb3Modal';
import cleanWeb3Modal from 'core/services/cleanWeb3Modal';
import { FETCH_MENU } from 'core/redux/menu/actions';
import { SkynetClient, defaultSkynetPortalUrl } from 'skynet-js';
import { actions } from './actions';

const getLoginState = (state) => state.login;

function onInjectedProviderChangesChannel(web3) {
  return eventChannel((emit) => {
    web3.currentProvider.publicConfigStore.on('update', (data) => {
      const { selectedAddress } = data;
      emit({ selectedAddress });
    });

    return () => {
      // unsubscribe
    };
  });
}

function* watchInjectedProviderChanges() {
  const { web3 } = yield select(getLoginState);
  const onSyncDoneChannel = yield call(onInjectedProviderChangesChannel, web3);
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      const web3UpdateEvent = yield take(onSyncDoneChannel);
      const { selectedAccount } = yield select(getLoginState);

      if (
        selectedAccount &&
        web3UpdateEvent.selectedAddress &&
        web3UpdateEvent.selectedAddress !== selectedAccount
      ) {
        onSyncDoneChannel.close();

        notification.error({
          message: 'Ethereum account switched',
          description: 'Logging out',
          placement: 'bottomRight',
        });

        yield put({
          type: actions.LOGOUT,
        });
      } else if (!selectedAccount) {
        onSyncDoneChannel.close();
      }
    }
  } catch (err) {
    console.error('web3 detect changes error:', err);
  }
}

function* INIT_WEB3_SAGA() {
  yield put({
    type: actions.INITIALIZING_WEB3,
    payload: {
      initializingWeb3: true,
      end2endLoadingIndicator: true,
    },
  });

  try {
    const web3Modal = yield call(getWeb3Modal);

    const provider = yield call(web3Modal.connect);

    const web3 = new Web3(provider);

    const selectedAccount = yield call(web3.eth.getCoinbase);

    // init skynet
    const skynetClient = new SkynetClient(defaultSkynetPortalUrl);

    yield put({
      type: actions.SET_WEB3,
      payload: {
        initializingWeb3: false,
        skynetClient,
        provider,
        web3Modal,
        web3,
        selectedAccount: selectedAccount.toLowerCase(),
        end2endLoadingIndicator: false,
        isLoggedIn: true,
      },
    });

    notification.info({
      message: 'You may now interact with the dApp',
      placement: 'bottomRight',
    });

    if (web3Modal.cachedProvider === 'injected') {
      yield race({
        task: fork(watchInjectedProviderChanges),
        cancel: take(actions.CANCEL_WATCH_INJECTED_PROVIDER),
      });
    }
  } catch (err) {
    yield put({
      type: actions.WEB3_ERROR,
      payload: {
        authorized: false,
        initializingWeb3: false,
        end2endLoadingIndicator: false,
      },
    });

    notification.error({
      message: 'Error connecting',
      placement: 'bottomRight',
    });
  }
}

function* LOGOUT_SAGA() {
  yield put({
    type: actions.SIGNING_OUT,
    payload: {
      signingOut: true,
    },
  });

  yield put({
    type: actions.CANCEL_WATCH_INJECTED_PROVIDER,
  });

  const { provider, web3Modal } = yield select(getLoginState);

  yield call(cleanWeb3Modal, provider, web3Modal);

  yield put({
    type: actions.LOGIN_SIGNOUT,
  });

  yield put(push(`/`));

  yield put({
    type: FETCH_MENU,
  });
}

export default function* rootSaga() {
  yield all([takeEvery(actions.INIT_WEB3, INIT_WEB3_SAGA), takeEvery(actions.LOGOUT, LOGOUT_SAGA)]);
}
