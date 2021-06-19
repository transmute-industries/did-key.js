import * as keyUtils from './keyUtils';
import { didCoreConformance } from '@transmute/did-key-test-vectors';
import bs58 from 'bs58';

const [example] = didCoreConformance.ed25519.key;

it('publicKeyBase58FromPublicKeyHex', async () => {
  expect(
    keyUtils.publicKeyBase58FromPublicKeyHex(
      bs58
        .decode(example.keypair['application/did+ld+json'].publicKeyBase58)
        .toString('hex')
    )
  ).toBe(example.keypair['application/did+ld+json'].publicKeyBase58);
});

it('privateKeyBase58FromPrivateKeyHex', async () => {
  expect(
    keyUtils.privateKeyBase58FromPrivateKeyHex(
      bs58
        .decode(example.keypair['application/did+ld+json'].privateKeyBase58)
        .toString('hex')
    )
  ).toBe(example.keypair['application/did+ld+json'].privateKeyBase58);
});

it('publicKeyJwkFromPublicKeyBase58', async () => {
  const jwk = keyUtils.publicKeyJwkFromPublicKeyBase58(
    example.keypair['application/did+ld+json'].publicKeyBase58
  );
  delete jwk.kid;
  expect(jwk).toEqual(example.keypair['application/did+json'].publicKeyJwk);
});

it('privateKeyJwkFromPrivateKeyBase58', async () => {
  const jwk = keyUtils.privateKeyJwkFromPrivateKeyBase58(
    example.keypair['application/did+ld+json'].privateKeyBase58
  );
  delete jwk.kid;
  expect(jwk).toEqual(example.keypair['application/did+json'].privateKeyJwk);
});

it('publicKeyBase58FromPublicKeyJwk', async () => {
  expect(
    keyUtils.publicKeyBase58FromPublicKeyJwk(
      example.keypair['application/did+json'].publicKeyJwk
    )
  ).toEqual(example.keypair['application/did+ld+json'].publicKeyBase58);
});

it('privateKeyBase58FromPrivateKeyJwk', async () => {
  expect(
    keyUtils.privateKeyBase58FromPrivateKeyJwk(
      example.keypair['application/did+json'].privateKeyJwk
    )
  ).toEqual(example.keypair['application/did+ld+json'].privateKeyBase58);
});

it('publicKeyHexFromPublicKeyBase58', async () => {
  expect(
    keyUtils.publicKeyHexFromPublicKeyBase58(
      example.keypair['application/did+ld+json'].publicKeyBase58
    )
  ).toEqual(
    bs58
      .decode(example.keypair['application/did+ld+json'].publicKeyBase58)
      .toString('hex')
  );
});

it('privateKeyHexFromPrivateKeyBase58', async () => {
  expect(
    keyUtils.privateKeyHexFromPrivateKeyBase58(
      example.keypair['application/did+ld+json'].privateKeyBase58
    )
  ).toEqual(
    bs58
      .decode(example.keypair['application/did+ld+json'].privateKeyBase58)
      .toString('hex')
  );
});
