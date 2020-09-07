import { jwkToBase58 } from './jwkToBase58';
import { keypair_0, keypair_1 } from '../__fixtures__';

it('can convert public key', () => {
  const publicKeyBase58 = jwkToBase58(keypair_0.publicKeyJwk);
  expect(publicKeyBase58).toEqual(keypair_1.publicKeyBase58);
});

it('can convert private key', () => {
  const privateKeyBase58 = jwkToBase58(keypair_0.privateKeyJwk);
  expect(privateKeyBase58).toEqual(keypair_1.privateKeyBase58);
});
