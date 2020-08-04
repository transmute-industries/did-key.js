import * as help from './crypto-helper-node';
import * as fixtures from '../__fixtures__';

jest.setTimeout(10 * 1000);
it('generate ', async () => {
  const key = await help.generate();
  expect(key.publicKeyJwk).toBeDefined();
  expect(key.privateKeyJwk).toBeDefined();
});

it('sign & verify', async () => {
  const signature = await help.sign(fixtures.message, fixtures.privateKeyJwk);
  let verified = await help.verify(
    fixtures.message,
    signature,
    fixtures.publicKeyJwk
  );
  expect(verified).toBe(true);
  verified = await help.verify(
    fixtures.message,
    fixtures.signature,
    fixtures.publicKeyJwk
  );
  expect(verified).toBe(true);
});

it('deriveSecret', async () => {
  const secret = await help.deriveSecret(
    fixtures.privateKeyJwk,
    fixtures.publicKeyJwk
  );
  expect(Buffer.from(secret)).toEqual(fixtures.derivedBits);
});
