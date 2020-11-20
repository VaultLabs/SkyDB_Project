const getShortAddress = (address) => {
  return `${address.substr(0, 6)} ... ${address.substr(-4)}`;
};

export default getShortAddress;
