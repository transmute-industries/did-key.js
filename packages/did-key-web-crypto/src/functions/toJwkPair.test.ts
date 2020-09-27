import { toJwkPair } from './toJwkPair';

import { didCoreConformance } from '@transmute/did-key-test-vectors';
const [example] = didCoreConformance['p-256'].key;

it('can convert public keypair', () => {
  const { id, controller, publicKeyBase58 } = example.keypair[
    'application/did+ld+json'
  ];
  const { publicKeyJwk, type } = example.keypair['application/did+json'];
  const k0 = toJwkPair({ id, type, controller, publicKeyBase58 });

  expect(k0).toEqual({
    id,
    type,
    controller,
    publicKeyJwk,
  });
});

it('can convert private keypair', () => {
  const { id, controller, publicKeyBase58, privateKeyBase58 } = example.keypair[
    'application/did+ld+json'
  ];
  const { publicKeyJwk, privateKeyJwk, type } = example.keypair[
    'application/did+json'
  ];
  const k0 = toJwkPair({
    id,
    type,
    controller,
    publicKeyBase58,
    privateKeyBase58,
  });
  expect(k0).toEqual({
    id,
    type,
    controller,
    publicKeyJwk,
    privateKeyJwk,
  });
});
