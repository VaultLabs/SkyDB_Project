import { channel, eventChannel } from 'redux-saga';
import { all, takeEvery, put, call, take, fork, select, race } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { notification } from 'antd';
import Web3 from 'web3';
import { cleanWeb3Modal } from 'core/services/Web3Modal';
import {
  actions as commitActions,
  commitSendSuccess,
  commitMinedSuccess,
  commitError,
} from 'core/redux/contracts/actions';
import { FETCH_MENU } from 'core/redux/menu/actions';
import { didAuthentication, setupIdx, linkIDXSkyDB } from 'core/services/SkyDB';
import { actions } from './actions';

// we need to import idx.ts to create the idx instance along with Ceramic

const getLoginState = (state) => state.login;
const getContractsState = (state) => state.contracts;

const registrationChannel = channel();

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
    const { authProvider, ceramic, idx, web3Modal } = yield call(didAuthentication);

    yield put({
      type: actions.AUTHENTICATED_WITH_DID,
      payload: {
        didAuthenticated: true,
        authProvider,
        ceramic,
        idx,
        selectedAccount: authProvider.address.toLowerCase(),
        web3Modal,
      },
    });

    notification.info({
      message: `Authenticated with DID ${idx.id}`,
      placement: 'bottomRight',
    });

    const seedKey = yield call(setupIdx, ceramic);

    yield put({
      type: actions.IDX_SETUP_CREATED,
      payload: {
        idxSetup: true,
        idxDefinitionID: seedKey,
      },
    });

    notification.info({
      message: `IDX setup created with definition ID ${seedKey}`,
      placement: 'bottomRight',
    });

    const skynetClient = yield call(linkIDXSkyDB, idx, seedKey);

    yield put({
      type: actions.IDX_SKYDB_LINK,
      payload: {
        idxSkyDBLink: true,
        skynetClient,
      },
    });

    notification.info({
      message: `IDX linked to SKYDb`,
      placement: 'bottomRight',
    });

    const web3 = new Web3(authProvider.provider);

    yield put({
      type: actions.SET_WEB3,
      payload: {
        web3,
        initializingWeb3: false,
        end2endLoadingIndicator: false,
        isLoggedIn: true,
      },
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

/**
 * @dev Event channel to control the smart contract update events
 */
function* handleRegistration() {
  while (true) {
    const eventAction = yield take(registrationChannel);
    switch (eventAction.type) {
      case commitActions.COMMIT_SEND_SUCCESS: {
        yield put(commitSendSuccess(eventAction.tx));
        break;
      }

      case commitActions.COMMIT_MINED_SUCCESS: {
        yield put(commitMinedSuccess(eventAction.receipt));

        yield put({
          type: actions.REGISTRATION_SUCCEEDED,
          payload: {
            checkingRoles: false,
            rolesChecked: true,
            hasRole: true,
          },
        });

        notification.info({
          message: 'You may now interact with the dApp',
          placement: 'bottomRight',
        });

        yield put({
          type: actions.STOP_CHANNEL_FORK,
        });

        break;
      }
      case commitActions.COMMIT_ERROR: {
        yield put(commitError(eventAction.error));
        break;
      }

      case actions.STOP_CHANNEL_FORK: {
        return;
      }

      default: {
        break;
      }
    }
  }
}

function* CHECK_ROLES_SAGA() {
  yield put({
    type: actions.CHECKING_ROLES,
    payload: {
      checkingRoles: true,
      rolesChecked: false,
    },
  });

  const { selectedAccount, web3 } = yield select(getLoginState);
  const { SpatialAssets } = yield select(getContractsState);

  const hasRole = yield call(
    SpatialAssets.instance.methods.hasRole(web3.utils.sha3('MINTER_ROLE'), selectedAccount).call,
  );

  if (hasRole) {
    yield put({
      type: actions.ROLES_CHECKED,
      payload: {
        checkingRoles: false,
        rolesChecked: true,
        hasRole: true,
      },
    });

    notification.info({
      message: 'You may now interact with the dApp',
      placement: 'bottomRight',
    });
  } else {
    notification.info({
      message: 'Your wallet will prompt you to take a commitment into the dApp so you can login',
      placement: 'bottomRight',
    });

    // fork to handle channel
    yield fork(handleRegistration);

    const gasEstimate = yield call(SpatialAssets.instance.methods.register().estimateGas, {
      from: selectedAccount,
    });

    try {
      SpatialAssets.instance.methods
        .register()
        .send({
          from: selectedAccount,
          gas: gasEstimate,
        })
        .once('transactionHash', (tx) => {
          registrationChannel.put({
            type: commitActions.COMMIT_SEND_SUCCESS,
            tx,
          });
        })
        .once('receipt', (receipt) => {
          registrationChannel.put({
            type: commitActions.COMMIT_MINED_SUCCESS,
            receipt,
          });
        })
        .on('error', (error) => {
          registrationChannel.put({
            type: commitActions.COMMIT_ERROR,
            error,
          });
        });
    } catch (err) {
      const errMsg = err.toString();
      const shortErr = errMsg.substring(0, errMsg.indexOf('.') + 1);
      put(commitError(shortErr));
    }
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
  yield all([
    takeEvery(actions.INIT_WEB3, INIT_WEB3_SAGA),
    takeEvery(actions.LOGOUT, LOGOUT_SAGA),
    takeEvery(actions.CHECK_ROLES, CHECK_ROLES_SAGA),
  ]);
}
