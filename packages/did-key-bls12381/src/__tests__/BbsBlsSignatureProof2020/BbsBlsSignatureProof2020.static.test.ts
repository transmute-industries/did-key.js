import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof,
} from '@mattrglobal/jsonld-signatures-bbs';

import { ld as vcjs } from '@transmute/vc.js';

import {
  key0,
  documentLoader,
  verifiableCredential,
  frame,
  derivedCredential,
  verifiablePresentation,
} from './__fixtures__';

import * as bls12381 from '../..';

let key: Bls12381G2KeyPair;
let suite: BbsBlsSignature2020;

const expectProofsToBeEqual = (a: any, b: any) => {
  // because these signatures are not deterministic,
  // we cannot compare the full proof
  // so we delete the parts that change
  delete a.proof.created;
  delete a.proof.proofValue;
  delete a.proof.nonce;
  const unstable: any = JSON.parse(JSON.stringify(b));
  delete unstable.proof.created;
  delete unstable.proof.proofValue;
  delete unstable.proof.nonce;
  expect(a).toEqual(unstable);
};

describe('generate / from / derive / present / verify', () => {
  it('generate', async () => {
    const res = await bls12381.generate(
      {
        secureRandom: () => {
          return Uint8Array.from(
            Buffer.from(
              '5a2b1f37ecc9fb7f27e1aa3daa4d66d9c3e54a4c0dcd53a4a5cacdfaf50578cb',
              'hex'
            )
          );
        },
      },
      { accept: 'application/did+ld+json' }
    );
    expect(res.keys[1]).toEqual(key0);
  });

  it('from', async () => {
    key = await Bls12381G2KeyPair.from(key0 as any);
    suite = new BbsBlsSignature2020({
      key,
      date: '2021-06-19T18:53:11Z',
    });
  });

  it('derive', async () => {
    const vc = await deriveProof(verifiableCredential, frame, {
      suite: new BbsBlsSignatureProof2020(),

      documentLoader: async (iri: string) => {
        if (iri.startsWith(key0.controller)) {
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

    expectProofsToBeEqual(vc, derivedCredential);
  });

  it('present', async () => {
    const vp = await vcjs.signPresentation({
      presentation: {
        // note that this is required because BBS+ is not in credentials/v1
        '@context': derivedCredential['@context'],
        type: ['VerifiablePresentation'],
        holder: key.controller,
        verifiableCredential: [derivedCredential],
      },
      challenge: 'nonce-123',
      domain: 'example.com',
      suite,
      documentLoader,
    });
    expectProofsToBeEqual(vp, verifiablePresentation);
  });

  it('verify', async () => {
    const verification = await vcjs.verify({
      presentation: verifiablePresentation,
      challenge: 'nonce-123',
      domain: 'example.com',
      suiteMap: {
        BbsBlsSignature2020,
        BbsBlsSignatureProof2020,
      },
      documentLoader: async (iri: string) => {
        if (iri.startsWith(key0.controller)) {
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
    expect(verification.verified).toBe(true);
  });
});
