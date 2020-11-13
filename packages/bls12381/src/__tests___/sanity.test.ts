
import { Bls12381G1KeyPair, Bls12381G2KeyPair } from '@mattrglobal/bls12381-key-pair'

const message = 'hello world';

it('g1: can generate sign and verify', async ()=>{
    try{
        const key = await Bls12381G1KeyPair.generate();
        const signer = key.signer();
        const signature = await signer.sign({
          data: new Uint8Array(Buffer.from(message)),
        });
        const verifier = key.verifier();
        const verified = await verifier.verify({
          data: new Uint8Array(Buffer.from(message)),
          signature,
        });
        expect(verified).toBe(true)
    } catch(e){
        expect(e.message).toBe('Not Implemented')
    }
   
})

it('g2: can generate sign and verify', async ()=>{
    const key = await Bls12381G2KeyPair.generate();
    const signer = key.signer();
    const signature = await signer.sign({
      data: new Uint8Array(Buffer.from(message)),
    });
    const verifier = key.verifier();
    const verified = await verifier.verify({
      data: new Uint8Array(Buffer.from(message)),
      signature,
    });
    expect(verified).toBe(true)
})