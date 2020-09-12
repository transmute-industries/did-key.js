import * as keyUtils from './keyUtils';

import { keypair } from './__fixtures__/keypair.json';

// https://tools.ietf.org/html/rfc8037#appendix-A.3
it('getKid', async () => {
  const kid = keyUtils.getKid({
    crv: 'Ed25519',
    kty: 'OKP',
    x: '11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo',
  });
  expect(kid).toBe('kPrK_qmxVWaYVA9wwBF6Iuo3vVzz7TxHCTwXBygrS4k');
});

it('publicKeyJwkFromPublicKeyBase58', async () => {
  const _jwk = keyUtils.publicKeyJwkFromPublicKeyBase58(
    keypair[0].X25519KeyAgreementKey2019.publicKeyBase58
  );
  delete _jwk.kid;
  expect(_jwk).toEqual(keypair[0].JsonWebKey2020.publicKeyJwk);
});

it('privateKeyJwkFromPrivateKeyBase58', async () => {
  const _jwk = keyUtils.privateKeyJwkFromPrivateKeyBase58(
    keypair[0].X25519KeyAgreementKey2019.publicKeyBase58,
    keypair[0].X25519KeyAgreementKey2019.privateKeyBase58
  );
  delete _jwk.kid;
  expect(_jwk).toEqual(keypair[0].JsonWebKey2020.privateKeyJwk);
});

it('privateKeyHexFromPrivateKeyBase58', async () => {
  const _privateKeyHex = keyUtils.privateKeyHexFromPrivateKeyBase58(
    keypair[0].X25519KeyAgreementKey2019.privateKeyBase58
  );
  expect(_privateKeyHex).toEqual(
    '0000000000000000000000000000000000000000000000000000000000000000'
  );
});

it('publicKeyHexFromPublicKeyBase58', async () => {
  const _privateKeyHex = keyUtils.publicKeyHexFromPublicKeyBase58(
    keypair[0].X25519KeyAgreementKey2019.publicKeyBase58
  );
  expect(_privateKeyHex).toEqual(
    '2fe57da347cd62431528daac5fbb290730fff684afc4cfc2ed90995f58cb3b74'
  );
});

it('privateKeyBase58FromPrivateKeyJwk', async () => {
  const _privateKeyBase58 = keyUtils.privateKeyBase58FromPrivateKeyJwk(
    keypair[0].JsonWebKey2020.privateKeyJwk
  );
  expect(_privateKeyBase58).toEqual(
    keypair[0].X25519KeyAgreementKey2019.privateKeyBase58
  );
});

it('publicKeyBase58FromPublicKeyJwk', async () => {
  const _publicKeyBase58 = keyUtils.publicKeyBase58FromPublicKeyJwk(
    keypair[0].JsonWebKey2020.publicKeyJwk
  );
  expect(_publicKeyBase58).toEqual(
    keypair[0].X25519KeyAgreementKey2019.publicKeyBase58
  );
});

it('privateKeyBase58FromPrivateKeyHex', async () => {
  const _privateKeyBase58 = keyUtils.privateKeyBase58FromPrivateKeyHex(
    '0000000000000000000000000000000000000000000000000000000000000000'
  );
  expect(_privateKeyBase58).toEqual(
    keypair[0].X25519KeyAgreementKey2019.privateKeyBase58
  );
});

it('publicKeyBase58FromPublicKeyHex', async () => {
  const _publicKeyBase58 = keyUtils.publicKeyBase58FromPublicKeyHex(
    '2fe57da347cd62431528daac5fbb290730fff684afc4cfc2ed90995f58cb3b74'
  );
  expect(_publicKeyBase58).toEqual(
    keypair[0].X25519KeyAgreementKey2019.publicKeyBase58
  );
});
