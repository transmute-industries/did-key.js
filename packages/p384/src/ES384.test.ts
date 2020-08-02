import * as fixtures from './__fixtures__';
import * as ES384 from './ES384';

it('sign & verify', async () => {
  const jws = await ES384.sign(
    fixtures.privateKeyJwk,
    fixtures.payload,
    fixtures.header
  );
  expect(jws).toBeDefined();
  const verified = await ES384.verify(fixtures.publicKeyJwk, jws);
  expect(verified).toBe(true);
});

it('detached -- sign & verify', async () => {
  const jws = await ES384.signDetached(
    fixtures.privateKeyJwk,
    fixtures.message,
    fixtures.header
  );
  expect(jws).toBeDefined();
  const verified = await ES384.verifyDetached(
    fixtures.publicKeyJwk,
    jws,
    fixtures.message
  );
  expect(verified).toBe(true);
});
