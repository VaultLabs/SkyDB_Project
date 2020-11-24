import Web3Modal from 'web3modal';
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect';

export const wallet = new ThreeIdConnect();

export const web3Modal = new Web3Modal({
  theme: 'dark',
  cacheProvider: false,
});

export const getAuthProvider = async () => {
  const ethProvider = await web3Modal.connect();
  const addresses = await ethProvider.enable();

  const authProvider = new EthereumAuthProvider(ethProvider, addresses[0]);

  return {
    authProvider,
    web3Modal,
  };
};

export const cleanWeb3Modal = async (provider, wb3Modal) => {
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

  wb3Modal.clearCachedProvider();
};
