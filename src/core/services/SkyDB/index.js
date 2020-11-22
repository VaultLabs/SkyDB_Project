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
