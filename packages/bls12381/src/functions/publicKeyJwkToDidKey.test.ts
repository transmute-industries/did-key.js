import { generateKeyPairs } from './generateKeyPairs'
import { toJsonWebKeyPair } from './toJsonWebKeyPair'
import { publicKeyJwkToDidKey } from './publicKeyJwkToDidKey'


describe('publicKeyJwkToDidKey',  ()=>{
    it('g1', async ()=>{
        const pairs = await generateKeyPairs();
        const g1 = toJsonWebKeyPair(pairs.bls12381G1KeyPair);
        expect(g1.publicKeyJwk).toBeDefined()
        const did1 = publicKeyJwkToDidKey(g1.publicKeyJwk)
        // console.log(did1)
        expect(did1).toBeDefined()
    })

    it('g2', async ()=>{
        const pairs = await generateKeyPairs();
        const g2 = toJsonWebKeyPair(pairs.bls12381G2KeyPair);
        expect(g2.publicKeyJwk).toBeDefined()
        const did1 = publicKeyJwkToDidKey(g2.publicKeyJwk)
        // console.log(did1)
        expect(did1).toBeDefined()
    })
  
})