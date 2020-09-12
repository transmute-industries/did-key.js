import { deriveSecret } from './Jwe';

import { keypair } from '../__fixtures__';

it('can deriveSecret', async () => {
  const secret = await deriveSecret(
    keypair[0].generate.privateKeyJwk,
    keypair[0].generate.publicKeyJwk
  );
  expect(Buffer.from(secret).toString('hex')).toBe(
    'd9c7be54ed517b6e8f75c7e7656d12902de066a5e09e1dcbddce682b81b3deb8'
  );
});
