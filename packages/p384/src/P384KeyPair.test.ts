import * as fixtures from './__fixtures__';
import { P384KeyPair } from './P384KeyPair';

it('generate', async () => {
  const key = await P384KeyPair.generate();
  expect(key.type).toBe('JsonWebKey2020');
});

it('from', async () => {
  const key = await P384KeyPair.from({
    publicKeyJwk: fixtures.publicKeyJwk,
    privateKeyJwk: fixtures.privateKeyJwk,
  });
  expect(key.type).toBe('JsonWebKey2020');
  expect(key.id).toBe(
    '#zUewNx6pAKABMemqTqcEWAEPVxht1ktr9ugLyXkoHiSAzhQBDNRdC2nLauoLKcwstytQCYeCazJ8m4rowp27ivJS4NmofDMAMjLqbqcn1tVKQTAk45d7wzcJZwJaZaAkSu78wFK'
  );
  expect(key.controller).toBe(
    'did:key:zUewNx6pAKABMemqTqcEWAEPVxht1ktr9ugLyXkoHiSAzhQBDNRdC2nLauoLKcwstytQCYeCazJ8m4rowp27ivJS4NmofDMAMjLqbqcn1tVKQTAk45d7wzcJZwJaZaAkSu78wFK'
  );
});

it('toVerificationMethod', async () => {
  const key = await P384KeyPair.from({
    publicKeyJwk: fixtures.publicKeyJwk,
    privateKeyJwk: fixtures.privateKeyJwk,
  });
  const vm = key.toVerificationMethod();
  expect(vm.type).toBe('JsonWebKey2020');
  const expected = fixtures.publicKeyJwk;
  delete expected.key_ops;
  delete expected.ext;
  expect(vm.publicKeyJwk).toEqual(expected);
});

it('sign & verify', async () => {
  const key = await P384KeyPair.from({
    privateKeyJwk: fixtures.privateKeyJwk,
  });
  const signer = key.signer();
  const signature = await signer.sign({ data: fixtures.message });
  const verifier = key.verifier();
  const verified = await verifier.verify({ data: fixtures.message, signature });
  expect(verified).toBe(true);
});
