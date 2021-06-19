import { generateKeyPairs } from './generateKeyPairs';
import { toJsonWebKeyPair } from './toJsonWebKeyPair';

import { keypairsToDidKey } from './keypairsToDidKey';

it('keypairsToDidKey', async () => {
  const pairs = await generateKeyPairs();
  const g1 = toJsonWebKeyPair(pairs.bls12381G1KeyPair);
  const g2 = toJsonWebKeyPair(pairs.bls12381G2KeyPair);
  const did1 = keypairsToDidKey(g1, g2);
  // console.log(did1)
  expect(did1).toBeDefined();
});
