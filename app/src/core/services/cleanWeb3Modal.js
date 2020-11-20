const cleanWeb3Modal = async (provider, web3Modal) => {
  // eslint-disable-next-line
  if (provider._portis) {
    // eslint-disable-next-line
    await provider._portis.logout();
  }

  if (provider.fm) {
    await provider.fm.user.logout();
  }

  if (provider.torus) {
    await provider.torus.cleanUp();
  }

  web3Modal.clearCachedProvider();
};

export default cleanWeb3Modal;
