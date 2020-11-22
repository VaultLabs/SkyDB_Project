import { createDefinition, publishSchema } from '@ceramicstudio/idx-tools';
import { SkynetClient, genKeyPairFromSeed, defaultSkynetPortalUrl } from 'skynet-js';
import { fromString, toString } from 'uint8arrays';
import createCeramic from '../Ceramic';
import createIDX from '../IDX';
import { getAuthProvider } from '../Web3Modal';

const ceramicPromise = createCeramic();

const SkyDBSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'SkyDB',
  type: 'object',
};

export const loadKeyPair = async (idx, seedKey) => {
  const jwe = await idx.get(seedKey);
  if (jwe == null) {
    return null;
  }
  const decrypted = await idx.did.decryptJWE(jwe);
  return genKeyPairFromSeed(toString(decrypted));
};

export const didAuthentication = async () => {
  console.log('Authenticating...');
  const { authProvider, web3Modal } = await getAuthProvider();
  const ceramic = await ceramicPromise;
  const idx = await createIDX(ceramic, { authProvider });

  console.log('Authenticated with DID:', idx.id);

  return {
    authProvider,
    ceramic,
    idx,
    web3Modal,
  };
};

export const setupIdx = async (ceramic) => {
  console.log('Creating IDX setup...');
  // @ts-ignore
  const schemaID = await publishSchema(ceramic, { content: SkyDBSchema });
  const definitionID = await createDefinition(ceramic, {
    name: 'SkyDB',
    description: 'SkyDB seed',
    schema: schemaID.toUrl('base36'),
  });
  const seedKey = definitionID.toString();

  console.log('IDX setup created with definition ID:', seedKey);

  return seedKey;
};

export const linkIDXSkyDB = async (idx, seedKey) => {
  const createKeyPair = async (seed) => {
    const jwe = await idx.did.createJWE(fromString(seed), [idx.id]);
    await idx.set(seedKey, jwe);
    return genKeyPairFromSeed(seed);
  };

  const kp = await createKeyPair('my seed phrase');

  const skynetClient = new SkynetClient(defaultSkynetPortalUrl);

  await skynetClient.db.setJSON(kp.privateKey, 'hello', { hello: 'SkyDB with IDX' });

  await skynetClient.db.getJSON(kp.publicKey, 'hello');

  return skynetClient;
};

export const getStac = async (skynetClient, publicKey, itemId) => {
  try {
    // const { publicKey } = genKeyPairFromSeed(secret);
    const entry = await skynetClient.db.getJSON(publicKey, itemId);

    return entry;
  } catch (error) {
    return false;
  }
};

export const setStac = async (skynetClient, privateKey, itemId, stac) => {
  try {
    await skynetClient.db.setJSON(privateKey, itemId, stac);

    return true;
  } catch (err) {
    return false;
  }
};
