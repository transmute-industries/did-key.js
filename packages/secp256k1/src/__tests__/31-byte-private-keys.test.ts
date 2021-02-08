import * as keyUtils from '../keyUtils';

// Originally reported in:
// https://github.com/transmute-industries/did-key.js/issues/63
it('private keys MUST always be 32 bytes', async () => {
  // this JWK generatetes 31 byte length private keys
  const example = {
    kty: 'EC',
    crv: 'secp256k1',
    d: 'H8IPdO0ZRDrma0Oc1ASGp4R-7ioP3HKC2o3dBYLHUg',
    x: 'F0UpAkmilL3GafMgs_NMLqwGpUYPEnFphet8wS21jMg',
    y: 'vTGyefjnlCj2-T7gYw3Det6m1UtDOfbB4CTzROlT6QA',
    kid: 'y3hMPnp_oK9BM_V9vXu0aErpbzz0mDKe7xjEG44doUg',
  };
  const privateKeyBuffer = keyUtils.privateKeyUInt8ArrayFromJwk(example);
  expect(privateKeyBuffer.length).toBe(32);
  const privateKeyJwk = keyUtils.privateKeyJwkFromPrivateKeyHex(
    privateKeyBuffer.toString('hex')
  );
  expect(privateKeyJwk).toEqual(example);
});
