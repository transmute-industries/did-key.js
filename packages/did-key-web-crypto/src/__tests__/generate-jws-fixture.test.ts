import fs from 'fs';
import path from 'path';

import {
  privateKeyToSigner,
  createJws,
  publicKeyToVerifier,
  verifyJws,
  createDetachedJws,
  verifyDetachedJws,
} from '../Jws/Jws';

import { keypair } from '../__fixtures__';

import { getJwsHeaderFromJwk } from '../functions/getJwsHeaderFromJwk';

const WRITE_FIXTURE_TO_DISK = false;

it('generate keypair fixture', async () => {
  const fixture: any = {
    jws: [],
  };
  await Promise.all(
    keypair.map(async kp => {
      const signer = await privateKeyToSigner(kp.generate.privateKeyJwk);
      const verifier = await publicKeyToVerifier(kp.generate.publicKeyJwk);
      const header = getJwsHeaderFromJwk(kp.generate.publicKeyJwk);
      const jws = await createJws(signer, 'b', header);
      const verified = await verifyJws(verifier, jws);
      expect(verified).toBe(true);

      delete header.kid;
      const message = Buffer.from('b');
      const detachedJws = await createDetachedJws(signer, message, header);
      const verifiedDetached = await verifyDetachedJws(
        verifier,
        message,
        detachedJws
      );
      expect(verifiedDetached).toBe(true);
      fixture.jws.push({ normal: jws, detached: detachedJws });
      return true;
    })
  );
  // uncomment to debug
  //   console.log(JSON.stringify(fixture, null, 2));
  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(__dirname, '../__fixtures__/jws.json'),
      JSON.stringify(fixture, null, 2)
    );
  }
});
