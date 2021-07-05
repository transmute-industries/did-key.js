# did-key-bls12381

```
npm i @transmute/did-key-bls12381@latest --save
```

## Usage

### Generate

```ts
import crypto from 'crypto';
import * as bls12381 from '@transmute/did-key-bls12381';
const { didDocument, keys } = await bls12381.generate(
  {
    secureRandom: () => {
      return Uint8Array.from(crypto.randomBytes(32));
    },
  },
  { accept: 'application/did+json' }
);
```

### Export

```ts
import { Bls12381KeyPairs } from '@transmute/did-key-bls12381';
const keys = await Bls12381KeyPairs.generate({
  secureRandom: () => {
    return Uint8Array.from(
      Buffer.from(
        '5a2b1f37ecc9fb7f27e1aa3daa4d66d9c3e54a4c0dcd53a4a5cacdfaf50578cb',
        'hex'
      )
    );
  },
});
const g1 = await keys.g1KeyPair.export({
  type: 'JsonWebKey2020',
  privateKey: true,
});
const g2 = await keys.g2KeyPair.export({
  type: 'JsonWebKey2020',
  privateKey: true,
});
```

#### BbsBlsSignature2020 and BbsBlsSignatureProof2020

This suite was created after `https://www.w3.org/2018/credentials/v1` so it must be added to the credential context.

```ts
import { ld as vcjs } from '@transmute/vc.js';
import * as bls12381 from '@transmute/did-key-bls12381';

import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof,
} from '@mattrglobal/jsonld-signatures-bbs';

const keys = await bls12381.Bls12381KeyPairs.generate({
  secureRandom: () => {
    return Uint8Array.from(
      Buffer.from(
        '5a2b1f37ecc9fb7f27e1aa3daa4d66d9c3e54a4c0dcd53a4a5cacdfaf50578cb',
        'hex'
      )
    );
  },
});
const g2 = await keys.g2KeyPair.export({
  type: 'Bls12381G2Key2020',
  privateKey: true,
});

const key = await Bls12381G2KeyPair.from(g2);

const suite = new BbsBlsSignature2020({
  key,
  date: '2021-06-19T18:53:11Z',
});

const verifiableCredential = await vcjs.issue({
  credential: {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      // 🧙‍♂️ This extension context is required.
      'https://w3id.org/security/suites/bls12381-2020/v1',
    ],
    id: 'http://example.gov/credentials/3732',
    type: ['VerifiableCredential'],
    issuer:
      'did:key:z5TcEUwEFkVuVhRpBinQrCgAtSmtQxyajQvpjma5TnWedYqJNXKYvS3UA4rrAkqfMm9VnhiZAf9gpqj7DJDsUJTAJkisUNbenUy64kitTduKihxQb4ScGb1XfRHzMMJWBQa7o7ar46ACzdfW4oqzpnj8gqLH2fjQF82LQACATNc3pXem8chkM7vEQKHKcK2HHK8tbVdfP',
    issuanceDate: '2021-06-19T18:53:11Z',
    credentialSubject: {
      id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
    },
  },
  suite,
  documentLoader,
});

const frame = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3id.org/security/suites/bls12381-2020/v1',
  ],
  type: ['VerifiableCredential'],
  credentialSubject: {
    '@explicit': true,
    id: {},
  },
};

const derivedVerifiableCredential = await deriveProof(
  verifiableCredential,
  frame,
  {
    suite: new BbsBlsSignatureProof2020(),
    documentLoader: async (iri: string) => {
      if (iri.startsWith('did:key:z5T')) {
        const { didDocument } = await bls12381.resolve(iri, {
          accept: 'application/did+ld+json',
        });
        return {
          document: didDocument,
        };
      }
      return documentLoader(iri);
    },
  }
);

const verifiablePresentation = await vcjs.signPresentation({
  presentation: {
    // note that this is required because BBS+ is not in credentials/v1
    '@context': derivedVerifiableCredential['@context'],
    type: ['VerifiablePresentation'],
    holder: g2.controller,
    verifiableCredential: [derivedVerifiableCredential],
  },
  challenge: 'nonce-123',
  domain: 'example.com',
  suite, // BbsBlsSignature2020 NOT BbsBlsSignatureProof2020
  documentLoader,
});

const verification = await vcjs.verify({
  presentation: verifiablePresentation,
  challenge: 'nonce-123',
  domain: 'example.com',
  suiteMap: {
    BbsBlsSignature2020,
    BbsBlsSignatureProof2020,
  },
  documentLoader: async (iri: string) => {
    if (iri.startsWith('did:key:z5T')) {
      const { didDocument } = await bls12381.resolve(iri, {
        accept: 'application/did+ld+json',
      });
      return {
        document: didDocument,
      };
    }
    return documentLoader(iri);
  },
});
```

### Resolve

```ts
import * as bls12381 from '@transmute/did-key-bls12381';
const {
  didDocument,
} = await bls12381.resolve(
  'did:key:z5TcEUwEFkVuVhRpBinQrCgAtSmtQxyajQvpjma5TnWedYqJNXKYvS3UA4rrAkqfMm9VnhiZAf9gpqj7DJDsUJTAJkisUNbenUy64kitTduKihxQb4ScGb1XfRHzMMJWBQa7o7ar46ACzdfW4oqzpnj8gqLH2fjQF82LQACATNc3pXem8chkM7vEQKHKcK2HHK8tbVdfP',
  { accept: 'application/did+json' }
);
```

## Representations

#### application/did+json

See [application/did+json](./src/__tests__/generate/__fixtures__/doc-0.json)

#### application/did+ld+json

See [application/did+ld+json](./src/__tests__/generate/__fixtures__/doc-0.ld.json)
