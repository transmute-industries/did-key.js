import { JsonWebSignature, JsonWebKey } from '@transmute/json-web-signature';
import { ld as vcjs } from '@transmute/vc.js';

import {
  documentLoader,
  key,
  credential,
  verifiableCredential,
  verifiablePresentation,
} from './__fixtures__';

const expectProofsToBeEqual = (a: any, b: any) => {
  // because these signatures are not deterministic,
  // we cannot compare the full proof
  // so we delete the parts that change
  delete a.proof.created;
  delete a.proof.jws;

  const unstable: any = JSON.parse(JSON.stringify(b));
  delete unstable.proof.created;
  delete unstable.proof.jws;

  expect(a).toEqual(unstable);
};

it('from / issue / prove / verify', async () => {
  const suite = new JsonWebSignature({
    key: await JsonWebKey.from(key as any),
    date: '2020-03-10T04:24:12Z',
  });

  const vc = await vcjs.issue({
    credential: { ...credential, issuer: key.controller },
    suite,
    documentLoader,
  });

  expectProofsToBeEqual(vc, verifiableCredential);

  const vp = await vcjs.signPresentation({
    presentation: {
      '@context': vc['@context'],
      type: ['VerifiablePresentation'],
      holder: key.controller,
      verifiableCredential: [verifiableCredential],
    },
    challenge: '123',
    suite,
    documentLoader,
  });

  expectProofsToBeEqual(vp, verifiablePresentation);

  const verification = await vcjs.verify({
    presentation: verifiablePresentation,
    challenge: '123',
    suite: new JsonWebSignature(),
    documentLoader,
  });

  expect(verification.verified).toBe(true);
});
