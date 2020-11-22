/* eslint-disable*/
import web3 from 'web3';

export default function itemIdGenerator(stacId) {
  const bytesHex = web3.utils.soliditySha3(stacId);
  // convert hexademical value to a decimal string
  return BigInt(bytesHex).toString(10);
}
