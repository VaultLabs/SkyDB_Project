/* eslint-disable*/

export default function random256Uint() {
  const bytes = new Uint8Array(32);

  // load cryptographically random bytes into array
  window.crypto.getRandomValues(bytes);

  // convert byte array to hexademical representation
  const bytesHex = bytes.reduce((o, v) => o + ('00' + v.toString(16)).slice(-2), '');

  // convert hexademical value to a decimal string
  return BigInt('0x' + bytesHex).toString(10);
}
