import * as secp256k1 from '../..';

import { JsonWebSignature, JsonWebKey } from '@transmute/json-web-signature';
import { ld as vcjs } from '@transmute/vc.js';

import {
  documentLoader,
  key,
  credential,
  verifiableCredential,
  verifiablePresentation,
} from './__fixtures__';

it('generate / issue / prove / verify', async () => {
  const k = await secp256k1.Secp256k1KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(
        '9085d2bef69286a6cbb51623c8fa258629945cd55ca705cc4e66700396894e0c',
        'hex'
      );
    },
  });

  expect(k.id).toBe(
    'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme#zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme'
  );

  const exportedKey = (await k.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  })) as any;

  expect(exportedKey).toEqual(key);
  const suite = new JsonWebSignature({
    key: await JsonWebKey.from(exportedKey),
    date: '2020-03-10T04:24:12Z',
  });

  const vc = await vcjs.issue({
    credential: { ...credential, issuer: key.controller },
    suite,
    documentLoader,
  });

  expect(vc).toEqual(verifiableCredential);

  const vp = await vcjs.signPresentation({
    presentation: {
      '@context': vc['@context'],
      type: ['VerifiablePresentation'],
      holder: key.controller,
      verifiableCredential: [vc],
    },
    challenge: '123',
    suite,
    documentLoader,
  });

  expect(vp).toEqual(verifiablePresentation);

  const verification = await vcjs.verify({
    presentation: vp,
    challenge: '123',
    suite: new JsonWebSignature(),
    documentLoader,
  });

  expect(verification.verified).toBe(true);
});
