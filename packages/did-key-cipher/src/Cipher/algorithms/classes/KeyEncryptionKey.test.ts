import { KeyEncryptionKey } from './KeyEncryptionKey';
import base64url from 'base64url';

// see also https://github.com/StableLib/stablelib/blob/master/packages/aes-kw/aes-kw.test.ts

const testVector = {
  Description: '256 bits of Key Data with a 256-bit KEK',
  KEK: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
  KeyData: '00112233445566778899AABBCCDDEEFF000102030405060708090A0B0C0D0E0F',
  WrappedKey:
    '28C9F404C4B810F4CBCCB35CFB87F8263F5786E2D80ED326CBC7F0E71A99F43BFB988B9B7A02DD21',
};

it('KeyEncryptionKey.wrapKey', async () => {
  const kekw = await KeyEncryptionKey.createKek({
    keyData: Buffer.from(testVector.KEK, 'hex'),
  });
  const wrapped = base64url.toBuffer(
    await kekw.wrapKey({
      unwrappedKey: Buffer.from(testVector.KeyData, 'hex'),
    })
  );
  expect(wrapped.toString('hex').toUpperCase()).toBe(testVector.WrappedKey);
});

it('KeyEncryptionKey.unwrapKey', async () => {
  const kekw = await KeyEncryptionKey.createKek({
    keyData: Buffer.from(testVector.KEK, 'hex'),
  });
  const unwrapped = Buffer.from(
    (await kekw.unwrapKey({
      wrappedKey: base64url.encode(Buffer.from(testVector.WrappedKey, 'hex')),
    })) as Uint8Array
  );
  expect(unwrapped.toString('hex').toUpperCase()).toBe(testVector.KeyData);
});
