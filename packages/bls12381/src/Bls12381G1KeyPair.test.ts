
import { Bls12381G1KeyPair } from './Bls12381G1KeyPair'

describe('Bls12381G1KeyPair', ()=>{
  it('generate', async ()=>{
    const g2KeyPair = await Bls12381G1KeyPair.generate();
    expect(g2KeyPair.publicKeyBuffer).toBeDefined();
    expect(g2KeyPair.privateKeyBuffer).toBeDefined();

  })

  it('fromFingerprint', async ()=>{
    const g2KeyPair = await Bls12381G1KeyPair.fromFingerprint({
      fingerprint: 'z3tEFuovkjrktb8DP4G3KZHHRc7duZdypve9HfbtAaqcax2dwjN9nDNoLqKQwMsGbKPBZa'
    });
    expect(g2KeyPair.publicKeyBuffer).toBeDefined();
    expect(g2KeyPair.privateKeyBuffer).not.toBeDefined();
  })

  it('toKeyPair', async ()=>{
    const g2KeyPair = await Bls12381G1KeyPair.generate();
    const vm = g2KeyPair.toKeyPair(false) 
    expect(vm.publicKeyBase58).toBeDefined();
    expect(vm.privateKeyBase58).not.toBeDefined();
    const kp = g2KeyPair.toKeyPair(true) 
    expect(kp.publicKeyBase58).toBeDefined();
    expect(kp.privateKeyBase58).toBeDefined();
  })

  it('toJsonWebKeyPair', async ()=>{
    const g2KeyPair = await Bls12381G1KeyPair.generate();
    const vm = g2KeyPair.toJsonWebKeyPair(false) 
    expect(vm.publicKeyJwk).toBeDefined();
    expect(vm.privateKeyJwk).not.toBeDefined();
    const kp = g2KeyPair.toJsonWebKeyPair(true) 
    expect(kp.publicKeyJwk).toBeDefined();
    expect(kp.privateKeyJwk).toBeDefined();
  })

  describe('from',  ()=>{
    it('toJsonWebKeyPair', async ()=>{
      const g2KeyPair = await Bls12381G1KeyPair.generate();
      const kp = g2KeyPair.toJsonWebKeyPair(true) 
      const kp2 = await Bls12381G1KeyPair.from(kp)
      expect(kp2.publicKeyBuffer).toBeDefined();
      expect(kp2.privateKeyBuffer).toBeDefined();
    })

    it('toKeyPair', async ()=>{
      const g2KeyPair = await Bls12381G1KeyPair.generate();
      const kp = g2KeyPair.toKeyPair(true) 
      const kp2 = await Bls12381G1KeyPair.from(kp)
      expect(kp2.publicKeyBuffer).toBeDefined();
      expect(kp2.privateKeyBuffer).toBeDefined();
    })
  })

  it('signer / verifier', async ()=>{
    try{
    const message = 'hello world';
    const g2KeyPair = await Bls12381G1KeyPair.generate();
    const signer = g2KeyPair.signer();
    const verifier = g2KeyPair.verifier();
    const signature = await signer.sign({
      data: new Uint8Array(Buffer.from(message))
    })
    const verified = await verifier.verify({
      data: new Uint8Array(Buffer.from(message)),
      signature
    })
    expect(verified).toBe(true)
  } catch(e){
    expect(e.message).toBe('Not Implemented')
}
  })
})