// import Ceramic from '@ceramicnetwork/ceramic-core'
import Ceramic from '@ceramicnetwork/ceramic-http-client';
// import dagJose from 'dag-jose'
// import IPFS from 'ipfs'
// @ts-ignore
// import multiformats from 'multiformats/basics'
// @ts-ignore
// import legacy from 'multiformats/legacy'

// @ts-ignore
// multiformats.multicodec.add(dagJose)
// @ts-ignore
// const dagJoseFormat = legacy(multiformats, dagJose.name)

export default async function createCeramic() {
  // @ts-ignore
  // window.ipfs = await IPFS.create({ ipld: { formats: [dagJoseFormat] } })
  // window.ceramic = await Ceramic.create(window.ipfs)
  // return window.ceramic
  window.ceramic = new Ceramic('https://ceramic.3boxlabs.com');
  return Promise.resolve(window.ceramic);
}
