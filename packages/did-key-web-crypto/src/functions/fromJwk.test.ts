import { fromJwk } from './fromJwk';
import { didCoreConformance } from '@transmute/did-key-test-vectors';
const [example] = didCoreConformance['p-256'].key;
const { privateKeyJwk, publicKeyJwk, controller, id, type } = example.keypair[
  'application/did+json'
];
const { publicKeyBase58, privateKeyBase58 } = example.keypair[
  'application/did+ld+json'
];

it('can convert public key', () => {
  const k0 = fromJwk(publicKeyJwk);
  expect(k0).toEqual({ publicKeyBase58, controller, id, type });
});

it('can convert private key', () => {
  const k0 = fromJwk(privateKeyJwk);
  expect(k0).toEqual({
    publicKeyBase58,
    privateKeyBase58,
    controller,
    id,
    type,
  });
});
