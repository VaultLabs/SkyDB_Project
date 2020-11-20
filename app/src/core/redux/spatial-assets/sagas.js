import { channel } from 'redux-saga';
import { all, takeEvery, put, call, select, take, fork } from 'redux-saga/effects';
import axios from 'axios';
import {
  actions as commitActions,
  commitSendSuccess,
  commitMinedSuccess,
  commitError,
} from 'core/redux/contracts/actions';
import { setStac } from 'core/services/SkyDB';
import { genKeyPairFromSeed } from 'skynet-js';
import utils from 'utils';
import { notification } from 'antd';
import { actions } from './actions';

const getSpatialAssetsState = (state) => state.spatialAssets;
const getContractsState = (state) => state.contracts;
const getLoginState = (state) => state.login;

const geoDIDRegistrationChannel = channel();

async function fetchFromTilesRdnt(loadedCogs) {
  const responses = [];
  const loadedTiffJson = [];

  await Promise.all(
    loadedCogs.map(async (cog) => {
      const response = await axios.get(`https://tiles.rdnt.io/tiles?url=${cog}`);
      responses.push({
        ...response,
        cog,
      });
    }),
  );

  responses.forEach((response) => {
    if (response.status === 200) {
      loadedTiffJson.push({
        ...response.data,
        cog: response.cog,
      });
    } else {
      loadedTiffJson.push({
        status: 'error fetching resource',
        cog: response.cog,
      });
    }
  });
  return loadedTiffJson;
}

function* LOAD_COGS_SAGA(action) {
  const { payload } = action;
  const { loadedCogs } = payload;

  const loadedTiffJson = yield call(fetchFromTilesRdnt, loadedCogs);

  yield put({
    type: actions.COGS_LOADED,
    payload: {
      loadedCogs,
      loadedTiffJson,
    },
  });
}

/**
 * @dev Event channel to control the smart contract update events
 */
function* handleGeoDIDRegistration() {
  while (true) {
    const eventAction = yield take(geoDIDRegistrationChannel);
    switch (eventAction.type) {
      case commitActions.COMMIT_SEND_SUCCESS: {
        yield put(commitSendSuccess(eventAction.tx));
        break;
      }

      case commitActions.COMMIT_MINED_SUCCESS: {
        yield put(commitMinedSuccess(eventAction.receipt));

        const { skynetClient } = yield select(getLoginState);
        const { privateKey } = genKeyPairFromSeed(eventAction.itemId);

        const sendToSkyNet = yield call(
          setStac,
          skynetClient,
          privateKey,
          eventAction.itemId,
          eventAction.spatialAsset,
        );

        console.log(sendToSkyNet);

        yield put({
          type: actions.SPATIAL_ASSET_REGISTERED,
          payload: {
            registeringSpatialAsset: false,
            spatialAssetRegistered: true,
          },
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

function* REGISTER_SPATIAL_ASSET_SAGA() {
  yield put({
    type: actions.REGISTERING_SPATIAL_ASSET,
    payload: {
      registeringSpatialAsset: true,
      spatialAssetRegistered: false,
    },
  });

  const { SpatialAssets } = yield select(getContractsState);
  const { selectedAccount } = yield select(getLoginState);
  const { spatialAsset } = yield select(getSpatialAssetsState);

  // generate 256 bit long id from STAC id
  const itemId = yield call(utils.itemIdGenerator, spatialAsset.id);

  const idCreated = yield call(SpatialAssets.instance.methods.idStatus(itemId).call);

  if (!idCreated) {
    // fork to handle channel
    yield fork(handleGeoDIDRegistration);

    const gasEstimate = yield call(
      SpatialAssets.instance.methods.mint(selectedAccount, itemId, 1, '0x0').estimateGas,
      {
        from: selectedAccount,
      },
    );

    try {
      SpatialAssets.instance.methods
        .mint(selectedAccount, itemId, 1, '0x0')
        .send({
          from: selectedAccount,
          gas: gasEstimate,
        })
        .once('transactionHash', (tx) => {
          geoDIDRegistrationChannel.put({
            type: commitActions.COMMIT_SEND_SUCCESS,
            tx,
          });
        })
        .once('receipt', (receipt) => {
          geoDIDRegistrationChannel.put({
            type: commitActions.COMMIT_MINED_SUCCESS,
            itemId,
            spatialAsset,
            selectedAccount,
            receipt,
          });
        })
        .on('error', (error) => {
          geoDIDRegistrationChannel.put({
            type: commitActions.COMMIT_ERROR,
            error,
          });
        });
    } catch (err) {
      const errMsg = err.toString();
      const shortErr = errMsg.substring(0, errMsg.indexOf('.') + 1);
      put(commitError(shortErr));
    }
  } else {
    notification.error({
      message: 'This STAC Item already exists as a geoDID',
      placement: 'bottomRight',
    });

    yield put({
      type: actions.REGISTERING_SPATIAL_ASSET,
      payload: {
        registeringSpatialAsset: false,
        spatialAssetRegistered: false,
      },
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_COGS, LOAD_COGS_SAGA),
    takeEvery(actions.REGISTER_SPATIAL_ASSET, REGISTER_SPATIAL_ASSET_SAGA),
  ]);
}
