import { JWS, JWK } from 'jose';
import * as ES256K from '../ES256K';

import * as fixtures from '../__fixtures__';

const payload = { hello: 'world' };

it('interop', async () => {
  let count = 0;
  let limit = 100;
  let errorCount = 0;

  while (count < limit) {
    const theirJws = await JWS.sign(
      payload,
      JWK.asKey(fixtures.privateKeyJwk as any)
    );
    const theirVerification = await JWS.verify(
      theirJws,
      JWK.asKey(fixtures.publicKeyJwk as any)
    );
    expect(theirVerification).toEqual(payload);
    const ourJws = await ES256K.sign(payload, fixtures.privateKeyJwk);
    const ourVerification = await ES256K.verify(ourJws, fixtures.publicKeyJwk);
    expect(ourVerification).toEqual(payload);

    const theirVerificationOfOurs = await JWS.verify(
      ourJws,
      JWK.asKey(fixtures.publicKeyJwk as any)
    );
    expect(theirVerificationOfOurs).toEqual(payload);

    try {
      const ourVerificationOfTheirs = await ES256K.verify(
        theirJws,
        fixtures.publicKeyJwk
      );
      expect(ourVerificationOfTheirs).toEqual(payload);
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
