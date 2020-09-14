import { fromJwk } from './fromJwk';
import { keypair } from '../__fixtures__';

it('can convert public key', () => {
  const k0 = fromJwk(keypair[0].generate.publicKeyJwk);
  const fixtureWithoutPrivateKey = { ...keypair[0].fromJwk };
  delete fixtureWithoutPrivateKey.privateKeyBase58;
  expect(k0).toEqual(fixtureWithoutPrivateKey);
});

it('can convert private key', () => {
  const k0 = fromJwk(keypair[0].generate.privateKeyJwk);
  expect(k0).toEqual(keypair[0].fromJwk);
});
