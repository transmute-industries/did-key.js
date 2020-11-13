import { generateKeyPairs } from './generateKeyPairs'
import { toJsonWebKeyPair } from './toJsonWebKeyPair'

it('toJsonWebKeyPair', async ()=>{
    const pairs = await generateKeyPairs();
    const g1 = toJsonWebKeyPair(pairs.bls12381G1KeyPair);
    expect(g1.publicKeyJwk).toBeDefined()
    expect(g1.privateKeyJwk).toBeDefined()
})