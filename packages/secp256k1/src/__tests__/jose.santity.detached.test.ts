import { JWS, JWK } from 'jose';
import * as ES256K from '../ES256K';

import * as fixtures from '../__fixtures__';

const payload = Buffer.from('hello');
const header = {
  alg: 'ES256K',
  b64: false,
  crit: ['b64'],
};

it('interop', async () => {
  let count = 0;
  let limit = 100;
  let errorCount = 0;

  while (count < limit) {
    const theirJws = await JWS.sign(
      payload,
      JWK.asKey(fixtures.privateKeyJwk as any),
      header
    );

    const theirVerification = await JWS.verify(
      theirJws,
      JWK.asKey(fixtures.publicKeyJwk as any),
      { crit: ['b64'] }
    );
    expect(theirVerification).toEqual(payload.toString());
    const ourJws = await ES256K.signDetached(
      payload,
      fixtures.privateKeyJwk,
      header
    );
    const ourVerification = await ES256K.verifyDetached(
      ourJws,
      payload,
      fixtures.publicKeyJwk
    );
    expect(ourVerification).toEqual(true);
    let parts = ourJws.split('..');
    const ourJwsForThem = parts[0] + '.' + payload.toString() + '.' + parts[1];
    const theirVerificationOfOurs = await JWS.verify(
      ourJwsForThem,
      JWK.asKey(fixtures.publicKeyJwk as any),
      { crit: ['b64'] }
    );
    expect(theirVerificationOfOurs).toEqual(payload.toString());
    parts = theirJws.split('.');

    const theirJwsForUs = parts[0] + '..' + parts[2];
    try {
      const ourVerificationOfTheirs = await ES256K.verifyDetached(
        theirJwsForUs,
        payload,
        fixtures.publicKeyJwk
      );
      expect(ourVerificationOfTheirs).toEqual(true);
    } catch (e) {
      errorCount++;
      console.log(e);
    }
    count++;
  }
  // expect ~50% errors verifying OpenSSL based ECDSA secp256k1 signatures...
  // when signatures are not normalized to lower S
  // https://tezos.stackexchange.com/questions/2454/secp256k1-with-non-deterministic-signatures
  // console.log('errorCount: ', errorCount);
  expect(errorCount).toBe(0);
});
