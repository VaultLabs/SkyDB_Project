import { message } from 'antd';

export const actions = {
  INITIALIZE_CONTRACTS: 'contracts/initialize-contracts',
  CONTRACTS_SYNC_START: 'contracts/sync-start',
  CONTRACT_INITIALIZED: 'contracts/contracts-initialized',
  CONTRACTS_SYNCED: 'contracts/synced',
  COMMIT_CHANGE_STATE: 'contracts/commit-change-state',
  COMMIT_SEND_SUCCESS: 'contracts/commit-sent',
  COMMIT_MINED_SUCCESS: 'contracts/transaction-mined',
  COMMIT_ERROR: 'contracts/commit-error',
};

export const initializeContracts = (contracts, web3) => {
  return {
    type: actions.INITIALIZE_CONTRACTS,
    contracts,
    web3,
  };
};

export function commitSendSuccess(commitSendTx) {
  return {
    type: actions.COMMIT_SEND_SUCCESS,
    commitSendTx,
  };
}

export function commitMinedSuccess(commitMinedReceipt) {
  try {
    const msg = `Commit transaction ${commitMinedReceipt.transactionHash.substring(0, 8)}
          mined succesfully on block ${commitMinedReceipt.blockNumber}`;
    message.info(msg, 8);
  } catch (err) {
    console.log(err);
  }
  return {
    type: actions.COMMIT_MINED_SUCCESS,
    commitMinedReceipt,
  };
}

export function commitError(error) {
  return {
    type: actions.COMMIT_ERROR,
    error,
  };
}
