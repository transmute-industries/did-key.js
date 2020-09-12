import { jwkToBase58 } from './jwkToBase58';
import { keypair } from '../__fixtures__';

it('can convert public key', () => {
  const publicKeyBase58 = jwkToBase58(keypair[0].publicKeyJwk);
  expect(publicKeyBase58).toEqual(keypair[0].publicKeyBase58);
});

it('can convert private key', () => {
  const privateKeyBase58 = jwkToBase58(keypair[0].privateKeyJwk);
  expect(privateKeyBase58).toEqual(keypair[0].privateKeyBase58);
});
