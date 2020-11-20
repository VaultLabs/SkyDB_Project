import Web3Modal from 'web3modal';
/*
import Torus from '@toruslabs/torus-embed';
import Fortmatic from 'fortmatic';
import Squarelink from 'squarelink';
import Portis from '@portis/web3';
*/
import WalletConnectProvider from '@walletconnect/web3-provider';

const httpEndpoint = process.env.REACT_APP_HTTP_ENDPOINT;
const networkId = process.env.REACT_APP_NETWORK_ID;
/*
const squarelinkKey = process.env.REACT_APP_SQUARELINK_API_KEY;
const fortmaticKey = process.env.REACT_APP_FORTMATIC_API_KEY;
const portisKey = process.env.REACT_APP_PORTIS_API_KEY;
*/

const getWeb3Modal = () => {
  return new Web3Modal({
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
};

export default getWeb3Modal;
