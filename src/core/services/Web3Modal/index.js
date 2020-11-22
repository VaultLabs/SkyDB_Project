import Web3Modal from 'web3modal';
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect';
/*
import Torus from '@toruslabs/torus-embed';
import Fortmatic from 'fortmatic';
import Squarelink from 'squarelink';
import Portis from '@portis/web3';
*/
import WalletConnectProvider from '@walletconnect/web3-provider';

export const wallet = new ThreeIdConnect();

const httpEndpoint = process.env.REACT_APP_HTTP_ENDPOINT;
const networkId = process.env.REACT_APP_NETWORK_ID;
/*
const squarelinkKey = process.env.REACT_APP_SQUARELINK_API_KEY;
const fortmaticKey = process.env.REACT_APP_FORTMATIC_API_KEY;
const portisKey = process.env.REACT_APP_PORTIS_API_KEY;
*/

export const web3Modal = new Web3Modal({
  theme: 'dark',
  cacheProvider: false,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: {
          [networkId]: httpEndpoint,
        },
      },
    },
    /*
    torus: {
      package: Torus, // required
      options: {
        network: httpEndpoint,
      },
    },
    squarelink: {
      package: Squarelink, // required
      options: {
        id: squarelinkKey,
        network: {
          url: httpEndpoint,
          chainId: networkId,
        },
      },
    },
    fortmatic: {
      package: Fortmatic, // required
      options: {
        key: fortmaticKey,
        network: {
          rpcUrl: httpEndpoint,
          chainId: networkId,
        },
      },
    },
    portis: {
      package: Portis, // required
      options: {
        id: portisKey,
        network: {
          nodeUrl: httpEndpoint,
          chainId: networkId,
        },
      },
    },
    */
  },
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
