export const signMessage = async (
  message: string,
  tronWeb: any
): Promise<string> => {
  // convert to hex format and remove the beginning "0x"
  var hexStrWithout0x = tronWeb.toHex(message).replace(/^0x/, "");
  // conert hex string to byte array
  var byteArray = tronWeb.utils.code.hexStr2byteArray(hexStrWithout0x);
  // keccak256 computing, then remove "0x"
  var strHash = tronWeb.sha3(byteArray).replace(/^0x/, "");

  var signedStr = await tronWeb.trx.sign(strHash);

  return signedStr;
};
