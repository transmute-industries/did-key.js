import { generateKeyPairs } from './generateKeyPairs'

it('generateKeyPairs', async ()=>{
    const pairs = await generateKeyPairs();
    expect(pairs.bls12381G1KeyPair).toBeDefined()
    expect(pairs.bls12381G2KeyPair).toBeDefined()
})