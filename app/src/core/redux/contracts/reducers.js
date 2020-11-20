// Smart-Contracts
import generateContractsInitialState from 'core/services/contracts';
import SpatialAssets from '@astraldao/astral-protocol-contracts/build/contracts/SpatialAssets.json';
import { actions } from './actions';

// Contracts here
export const Contracts = [SpatialAssets];

const initialState = {
  ...generateContractsInitialState(Contracts),
  contractsInitialized: false,
  contractsInitializing: false,
  commitSendLoading: false,
  commitMinedLoading: false,
  commitError: null,
  commitSendTx: null,
  commitMinedReceipts: [],
};

export default function contractsReducer(state = initialState, action) {
  let reduced;
  switch (action.type) {
    case actions.CONTRACTS_SYNC_START:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.CONTRACT_INITIALIZED:
      reduced = {
        ...state,
        [action.name]: {
          ...state[action.name],
          synced: action.synced,
          instance: action.instance,
        },
      };
      break;

    case actions.CONTRACTS_SYNCED:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.COMMIT_CHANGE_STATE:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.COMMIT_SEND_SUCCESS:
      reduced = {
        ...state,
        commitSendLoading: false,
        commitError: false,
        commitSendTx: action.commitSendTx,
      };
      break;

    case actions.COMMIT_MINED_SUCCESS:
      reduced = {
        ...state,
        commitMinedLoading: false,
        commitError: false,
        commitMinedReceipts: [...state.commitMinedReceipts, action.commitMinedReceipt],
      };
      break;

    case actions.COMMIT_ERROR:
      reduced = {
        ...state,
        commitSendLoading: false,
        commitMinedLoading: false,
        commitError: action.error,
      };
      break;
    default:
      reduced = state;
  }
  return reduced;
}
