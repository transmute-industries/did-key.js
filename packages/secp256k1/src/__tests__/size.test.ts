import bs58 from 'bs58';

it('can check public key size', () => {
  const decoded = bs58.decode('24waDFAUAS16UpZwQQTXVEAmm17rQRjadjuAeBDW8aqL1');
  expect(decoded.length).toBe(33);
});
