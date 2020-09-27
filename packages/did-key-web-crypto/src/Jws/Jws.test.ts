import {
  privateKeyToSigner,
  createJws,
  publicKeyToVerifier,
  verifyJws,
  createDetachedJws,
  verifyDetachedJws,
} from './Jws';

import { didCoreConformance } from '@transmute/did-key-test-vectors';
const [example] = didCoreConformance['p-256'].key;

const { publicKeyJwk, privateKeyJwk } = example.keypair['application/did+json'];

import { getJwsHeaderFromJwk } from '../functions/getJwsHeaderFromJwk';

it('can sign and verify', async () => {
  const signer = await privateKeyToSigner(privateKeyJwk);
  const verifier = await publicKeyToVerifier(publicKeyJwk);
  const header = getJwsHeaderFromJwk(publicKeyJwk);
  const jws = await createJws(signer, 'b', header);
  const verified = await verifyJws(verifier, jws);
  expect(verified).toBe(true);
});

it('can sign and verify detached', async () => {
  const signer = await privateKeyToSigner(privateKeyJwk);
  const verifier = await publicKeyToVerifier(publicKeyJwk);
  const header: any = getJwsHeaderFromJwk(publicKeyJwk);
  delete header.kid;
  const message = Buffer.from('b');
  const jws = await createDetachedJws(signer, message, header);
  const verified = await verifyDetachedJws(verifier, message, jws);
  expect(verified).toBe(true);
});
