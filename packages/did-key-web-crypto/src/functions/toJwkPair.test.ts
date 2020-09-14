import { toJwkPair } from './toJwkPair';

import { keypair } from '../__fixtures__';

it('can convert public keypair', () => {
  const withoutPrivate: any = { ...keypair[0].fromJwk };
  delete withoutPrivate.privateKeyBase58;
  const fixtureWithouPrivate: any = { ...keypair[0].toJwkPair };
  delete fixtureWithouPrivate.privateKeyJwk;
  const k0 = toJwkPair(withoutPrivate);
  expect(k0).toEqual(fixtureWithouPrivate);
});

it('can convert private keypair', () => {
  const k0 = toJwkPair(keypair[0].fromJwk);
  expect(k0).toEqual(keypair[0].toJwkPair);
});
