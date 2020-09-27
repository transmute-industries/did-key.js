// import * as fixtures from '../__fixtures__';
import { keypair } from '../__fixtures__';

const { X25519KeyPair } = require('x25519-key-pair');

it('x25519-key-pair deriveSecret', async () => {
  const key = await X25519KeyPair.from(keypair[0].X25519KeyAgreementKey2019);
  const secret = key.deriveSecret({
    publicKey: keypair[1].X25519KeyAgreementKey2019,
  });
  expect(Buffer.from(secret).toString('hex')).toBe(
    '85deaad59be8c5a157b644acbc311beb8902d4cb3799d2d87c839e975c472e40'
  );
});
