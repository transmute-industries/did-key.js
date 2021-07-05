import { Ed25519KeyPair } from '..';
import { JWS } from '@transmute/jose-ld';

it('can sign and verify', async () => {
  const k = await Ed25519KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(
        '4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929',
        'hex'
      );
    },
  });
  const JWA_ALG = 'EdDSA';
  const signer = JWS.createSigner(k.signer('EdDsa'), JWA_ALG);
  const verifier = JWS.createVerifier(k.verifier('EdDsa'), JWA_ALG);
  const message = Uint8Array.from(Buffer.from('hello'));
  const signature = await signer.sign({ data: message });
  const verified = await verifier.verify({
    signature,
  });
  expect(verified);
});
