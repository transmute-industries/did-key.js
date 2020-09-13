import {
  privateKeyToSigner,
  createJws,
  publicKeyToVerifier,
  verifyJws,
  createDetachedJws,
  verifyDetachedJws,
} from './Jws';

import { keypair } from '../__fixtures__';

import { getJwsHeaderFromJwk } from '../functions/getJwsHeaderFromJwk';

it('can sign and verify', async () => {
  const signer = await privateKeyToSigner(keypair[0].generate.privateKeyJwk);
  const verifier = await publicKeyToVerifier(keypair[0].generate.publicKeyJwk);
  const header = getJwsHeaderFromJwk(keypair[0].generate.publicKeyJwk);
  const jws = await createJws(signer, 'b', header);
  const verified = await verifyJws(verifier, jws);
  expect(verified).toBe(true);
});

it('can sign and verify detached', async () => {
  const signer = await privateKeyToSigner(keypair[0].generate.privateKeyJwk);
  const verifier = await publicKeyToVerifier(keypair[0].generate.publicKeyJwk);
  const header: any = getJwsHeaderFromJwk(keypair[0].generate.publicKeyJwk);
  delete header.kid;
  const message = Buffer.from('b');
  const jws = await createDetachedJws(signer, message, header);
  const verified = await verifyDetachedJws(verifier, message, jws);
  expect(verified).toBe(true);
});
