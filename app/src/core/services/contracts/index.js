const getAbi = (contractEntry) =>
  contractEntry.web3Contract ? contractEntry.web3Contract.options.jsonInterface : contractEntry.abi;

const isConstant = (x) => x.type === 'function' && x.constant === true;

const generateContractInitialState = (contractConfig) => {
  const constants = getAbi(contractConfig).filter(isConstant);
  const objectOfConstants = constants.reduce((acc, x) => ({ ...acc, [x.name]: {} }), {});
  return {
    synced: false,
    instance: null,
    ...objectOfConstants,
  };
};

const generateContractsInitialState = (contracts) =>
  (contracts || []).reduce((state, contract) => {
    // eslint-disable-next-line no-param-reassign
    state[contract.contractName] = generateContractInitialState(contract);
    return state;
  }, {});

export default generateContractsInitialState;
