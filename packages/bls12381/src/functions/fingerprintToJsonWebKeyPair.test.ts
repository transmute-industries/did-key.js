import { fingerprintToJsonWebKeyPair } from './fingerprintToJsonWebKeyPair';

describe('fingerprintToJsonWebKeyPair', () => {
  it('g1', () => {
    const fingerprint =
      'z3tEGJuCm1Eeq1mn2n6rr5P6D1kcbsM5EDpFGaFSGUQ4mh4M3jR7NmGKMmSeTD2yeU2DVB';
    const pairs = fingerprintToJsonWebKeyPair(fingerprint);
    expect(pairs.bls12381G1KeyPair).toBeDefined();
  });

  it('g2', () => {
    const fingerprint =
      'zUC7GVtd3MSTnieD6iVKShtkw7ZMi5udNcF6odytZoR9m4yFDrT7bk3KeH7Su5TGB7Q44281oNW6aEXbWW9bCQrHYZcJaB7HwiZBkdZtygnw72s3VYFPjrcsf3GbwLsAE4PdtvH';
    const pairs = fingerprintToJsonWebKeyPair(fingerprint);
    expect(pairs.bls12381G2KeyPair).toBeDefined();
  });

  it('g1 and g2', async () => {
    const fingerprint =
      'z5TcDbuBsdL8gW8iQgDvieFX8GxTH1zobxGhXLThNWBdZTd94c4Jv1hNDp36c59z96aysPgeZg24husJFEMuoLYgBWhZmJWMMJeCWV3NhHbpLapuEzaH1GRyYXp7BmcaAwjheowGStzKeVdJcbn9cfXNHbiMvgvkLzsHiFYqxi1HMMbPYfydR6GDa7vDghaWQkGBZoU4E';
    const pairs = fingerprintToJsonWebKeyPair(fingerprint);
    expect(pairs.bls12381G1KeyPair).toBeDefined();
    expect(pairs.bls12381G2KeyPair).toBeDefined();
  });
});
