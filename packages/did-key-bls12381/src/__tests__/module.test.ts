import crypto from 'crypto';
import * as bls12381 from '..';

it('has exports', () => {
  expect(bls12381.generate).toBeDefined();
  expect(bls12381.resolve).toBeDefined();
});

it('can generate', async () => {
  const res = await bls12381.generate(
    {
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    },
    { accept: 'application/did+json' }
  );
  expect(res.didDocument).toBeDefined();
  expect(res.keys).toBeDefined();
});

it('can resolve', async () => {
  const res = await bls12381.resolve(
    'did:key:z5TcESXuYUE9aZWYwSdrUEGK1HNQFHyTt4aVpaCTVZcDXQmUheFwfNZmRksaAbBneNm5KyE52SdJeRCN1g6PJmF31GsHWwFiqUDujvasK3wTiDr3vvkYwEJHt7H5RGEKYEp1ErtQtcEBgsgY2DA9JZkHj1J9HZ8MRDTguAhoFtR4aTBQhgnkP4SwVbxDYMEZoF2TMYn3s',
    { accept: 'application/did+json' }
  );
  expect(res.didDocument).toBeDefined();
});
