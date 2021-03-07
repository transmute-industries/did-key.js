import { deriveSecret } from './Jwe';

import { didCoreConformance } from '@transmute/did-key-test-vectors';
const [example] = didCoreConformance['p-256'].key;
const { publicKeyJwk, privateKeyJwk } = example.keypair['application/did+json'];

it('can deriveSecret', async () => {
  const secret = await deriveSecret(privateKeyJwk, publicKeyJwk);
  expect(secret).toBeDefined();
});
