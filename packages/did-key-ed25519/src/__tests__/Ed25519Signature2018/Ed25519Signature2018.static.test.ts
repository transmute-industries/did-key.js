import * as ed25519 from '../..';

import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018,
} from '@transmute/ed25519-signature-2018';
import { ld as vcjs } from '@transmute/vc.js';

import {
  documentLoader,
  key,
  credential,
  verifiableCredential,
  // verifiablePresentation,
} from './__fixtures__';

it('generate / issue / prove / verify', async () => {
  const k = await ed25519.Ed25519KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(
        '4f66b355aa7b0980ff901f2295b9c562ac3061be4df86703eb28c612faae6578',
        'hex'
      );
    },
  });

  expect(k.id).toBe(
    'did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL#z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL'
  );

  const exportedKey = await k.export({
    type: 'Ed25519VerificationKey2018',
    privateKey: true,
  });

  expect(exportedKey).toEqual(key);

  const suite = new Ed25519Signature2018({
    key: await Ed25519VerificationKey2018.from(exportedKey),
    date: '2020-03-10T04:24:12Z',
  });

  const vc = await vcjs.issue({
    credential: { ...credential, issuer: key.controller },
    suite,
    documentLoader,
  });

  expect(vc).toEqual(verifiableCredential);

  // const vp = await vcjs.signPresentation({
  //   presentation: {
  //     '@context': vc['@context'],
  //     type: ['VerifiablePresentation'],
  //     holder: key.controller,
  //     verifiableCredential: [vc],
  //   },
  //   challenge: '123',
  //   suite,
  //   documentLoader,
  // });

  // expect(vp).toEqual(verifiablePresentation);

  // const verification = await vcjs.verify({
  //   presentation: vp,
  //   challenge: '123',
  //   suite: new JsonWebSignature(),
  //   documentLoader,
  // });

  // expect(verification.verified).toBe(true);
});
