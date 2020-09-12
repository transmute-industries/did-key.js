import { generateEphemeralKeyPair } from './generateEphemeralKeyPair';

it('can generateEphemeralKeyPair', async () => {
  const data = await generateEphemeralKeyPair();
  expect(data.keyPair).toBeDefined();
  expect(data.epk).toBeDefined();
});
