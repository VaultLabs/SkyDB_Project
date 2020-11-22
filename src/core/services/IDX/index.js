import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import KeyDidResolver from '@ceramicnetwork/key-did-resolver';
import { IDXWeb } from '@ceramicstudio/idx-web';
// import { CeramicApi } from '@ceramicnetwork/ceramic-common'
// import { WebAuthenticateOptions } from '@ceramicstudio/idx-web'

// Parameter Types: ceramic:CeramicApi and options:WebAuthenticateOptions
// Return type: idx: Promise<IDXWeb>
async function createIDX(ceramic, options) {
  const registry = {
    ...KeyDidResolver.getResolver(),
    ...ThreeIdResolver.getResolver(ceramic),
  };
  // @ts-ignore
  const idx = new IDXWeb({ ceramic, resolver: { registry } });
  await idx.authenticate(options);
  idx.did.setResolver(idx.resolver);
  window.idx = idx;
  return idx;
}

export default createIDX;
