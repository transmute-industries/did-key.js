import * as did from '../index';
import crypto from 'crypto';

const types = ['P-256', 'P-384', 'Ed25519', 'X25519', 'secp256k1'];

const fixture: any = {};

describe('did:jwk', () => {
  types.forEach((t) => {
    it(t, async () => {
      const { keys, didDocument } = await did.jwk.generate({
        type: t,
        method: 'jwk',
        accept: 'application/did+json',
        secureRandom: () => {
          return crypto.randomBytes(32);
        },
      });
      expect(keys[0].publicKeyJwk.crv).toBe(t);
      expect(didDocument.verificationMethod[0].publicKeyJwk.crv).toBe(t);
      fixture[t] = { keys, didDocument };
    });
  });
});

// it('can haz fixture', () => {
//   console.log(JSON.stringify(fixture, null, 2));
// });
