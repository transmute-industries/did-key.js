import { Bls12381G1KeyPair } from '../Bls12381G1KeyPair';
import { Bls12381G2KeyPair } from '../Bls12381G2KeyPair';
import { Bls12381KeyPairs } from '../Bls12381KeyPairs';
import { keyToDidDoc } from './keyToDidDoc';

describe('keyToDidDoc', () => {
  it('g1', async () => {
    const kp = await Bls12381G1KeyPair.generate();
    const doc = await keyToDidDoc(kp);
    expect(doc.id).toBeDefined();
  });
  it('g2', async () => {
    const kp = await Bls12381G2KeyPair.generate();
    const doc = await keyToDidDoc(kp);
    expect(doc.id).toBeDefined();
  });
  it('g1 and g2', async () => {
    const keypairs = await Bls12381KeyPairs.generate();
    const doc = await keyToDidDoc(keypairs);
    expect(doc.id).toBeDefined();
  });
});
