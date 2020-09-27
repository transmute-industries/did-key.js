import { didCoreConformance } from '@transmute/did-key-test-vectors';

import * as keyUtils from './keyUtils';

const [example] = didCoreConformance.x25519.key;

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
    example.keypair['application/did+ld+json'].publicKeyBase58
  );
  delete _jwk.kid;
  expect(_jwk).toEqual(example.keypair['application/did+json'].publicKeyJwk);
});

it('privateKeyJwkFromPrivateKeyBase58', async () => {
  const _jwk = keyUtils.privateKeyJwkFromPrivateKeyBase58(
    example.keypair['application/did+ld+json'].publicKeyBase58,
    example.keypair['application/did+ld+json'].privateKeyBase58
  );
  delete _jwk.kid;
  expect(_jwk).toEqual(example.keypair['application/did+json'].privateKeyJwk);
});

it('privateKeyHexFromPrivateKeyBase58', async () => {
  const _privateKeyHex = keyUtils.privateKeyHexFromPrivateKeyBase58(
    example.keypair['application/did+ld+json'].privateKeyBase58
  );
  expect(_privateKeyHex).toEqual(example.seed);
});

it('publicKeyHexFromPublicKeyBase58 / publicKeyBase58FromPublicKeyHex', async () => {
  const _privateKeyHex = keyUtils.publicKeyHexFromPublicKeyBase58(
    example.keypair['application/did+ld+json'].publicKeyBase58
  );
  expect(_privateKeyHex).toBeDefined();
});

it('privateKeyBase58FromPrivateKeyJwk', async () => {
  const _privateKeyBase58 = keyUtils.privateKeyBase58FromPrivateKeyJwk(
    example.keypair['application/did+json'].privateKeyJwk
  );
  expect(_privateKeyBase58).toEqual(
    example.keypair['application/did+ld+json'].privateKeyBase58
  );
});

it('publicKeyBase58FromPublicKeyJwk', async () => {
  const _publicKeyBase58 = keyUtils.publicKeyBase58FromPublicKeyJwk(
    example.keypair['application/did+json'].publicKeyJwk
  );
  expect(_publicKeyBase58).toEqual(
    example.keypair['application/did+ld+json'].publicKeyBase58
  );
});

it('privateKeyBase58FromPrivateKeyHex', async () => {
  const _privateKeyBase58 = keyUtils.privateKeyBase58FromPrivateKeyHex(
    example.seed
  );
  expect(_privateKeyBase58).toEqual(
    example.keypair['application/did+ld+json'].privateKeyBase58
  );
});
