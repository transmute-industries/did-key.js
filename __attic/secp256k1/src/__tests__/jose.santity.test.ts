import { JWS, JWK } from 'jose';
import * as ES256K from '../ES256K';

import { didCoreConformance } from '@transmute/did-key-test-vectors';
const [example] = didCoreConformance.secp256k1.key;

const payload = { hello: 'world' };

const { publicKeyJwk, privateKeyJwk } = example.keypair['application/did+json'];

it('interop', async () => {
  let count = 0;
  let limit = 100;
  let errorCount = 0;

  while (count < limit) {
    const theirJws = await JWS.sign(payload, JWK.asKey(privateKeyJwk as any));
    const theirVerification = await JWS.verify(
      theirJws,
      JWK.asKey(publicKeyJwk as any)
    );
    expect(theirVerification).toEqual(payload);
    const ourJws = await ES256K.sign(payload, privateKeyJwk);
    const ourVerification = await ES256K.verify(ourJws, publicKeyJwk);
    expect(ourVerification).toEqual(true);

    const theirVerificationOfOurs = await JWS.verify(
      ourJws,
      JWK.asKey(publicKeyJwk as any)
    );
    expect(theirVerificationOfOurs).toEqual(payload);

    try {
      const ourVerificationOfTheirs = await ES256K.verify(
        theirJws,
        publicKeyJwk
      );
      expect(ourVerificationOfTheirs).toEqual(true);
    } catch (e) {
      errorCount++;
    }
    count++;
  }
  // expect ~50% errors verifying OpenSSL based ECDSA secp256k1 signatures...
  // when signatures are not normalized to lower S
  // https://tezos.stackexchange.com/questions/2454/secp256k1-with-non-deterministic-signatures
  // console.log('errorCount: ', errorCount);
  expect(errorCount).toBe(0);
});
