import * as ed25519 from '..';
import { documentLoader } from '../__fixtures__';
import * as vcjs from '@transmute/vc.js';
import {
  Ed25519Signature2018,
  Ed25519KeyPair,
} from '@transmute/ed25519-signature-2018';

it('can generate, issue, prove and verify', async () => {
  const k = await ed25519.Ed25519KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(
        '4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929',
        'hex'
      );
    },
  });
  // this is required because of a bug.
  const key = await Ed25519KeyPair.from({
    ...(await k.export({
      type: 'Ed25519VerificationKey2018',
      privateKey: true,
    })),
  });
  const credential = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    id: 'http://example.gov/credentials/3732',
    type: ['VerifiableCredential'],
    issuer: {
      id: key.controller,
    },
    issuanceDate: '2020-03-10T04:24:12.164Z',
    credentialSubject: {
      id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
    },
  };
  const vc = await vcjs.ld.issue({
    credential,
    suite: new Ed25519Signature2018({
      key,
    }),
    documentLoader,
  });
  const vp = await vcjs.ld.signPresentation({
    presentation: await vcjs.ld.createPresentation({
      verifiableCredential: vc,
      holder: key.controller,
      documentLoader,
    }),
    challenge: '123',
    suite: new Ed25519Signature2018({
      key,
    }),
    documentLoader,
  });
  const presentation = await vcjs.ld.verify({
    presentation: vp,
    challenge: '123',
    suite: new Ed25519Signature2018(),
    documentLoader,
  });
  expect(presentation.verified).toBe(true);
});
