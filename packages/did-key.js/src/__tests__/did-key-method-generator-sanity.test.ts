import * as did from '../index';

it('method generator interface', async () => {
  const { keys, didDocument } = await did.key.generate({
    type: 'Ed25519', // 'P-256', 'P-384', 'X25519', 'secp256k1'
    accept: 'application/did+json',
    secureRandom: () => {
      return Buffer.from(
        '4f66b355aa7b0980ff901f2295b9c562ac3061be4df86703eb28c612faae6578',
        'hex'
      );
    },
  });
  expect(keys).toBeDefined();
  expect(didDocument).toBeDefined();
});
