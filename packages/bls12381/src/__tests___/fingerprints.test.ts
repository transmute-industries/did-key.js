import {Bls12381G2KeyPair} from '../Bls12381G2KeyPair'
import { Bls12381G1KeyPair } from '../Bls12381G1KeyPair'
import { Bls12381KeyPairs } from '../Bls12381KeyPairs'

it('g1', async ()=>{
    const fingerprint = 'z5PG8APYnYLS9tczGCUhwyuczQRqRLWkMK2mvSBuoNho9gfJtZSvFSX9DpDPi5CnvdGoFdZwN7CeFbSWuvDY1fK7mRnG1hASENGbUJZQGVt6iWKM21FGFJ8NU21G91S2YbKgU4nFHbcmP8JGjXZS1QtjRw1FBa8eifPj3dddPTbN6WZDH6SEL119ypMCCQgkWhgm22LU8'
    const kp = await Bls12381G1KeyPair.fromFingerprint({
        fingerprint
    })
    expect(kp.fingerprint()).toEqual(fingerprint)
})

it('g2', async ()=>{
    const fingerprint = 'zUC75EFftXBGgCWu2cHamiGpDVUdp21gPVdsjpmKLLM6bjSuUNZ4YhTyj2EaeVCDf2JtL7DTUjrJBrVcdpKDB4LThkrMoP4dUFug1E75LN8YtscfsdpNi1Da6kV5DiJ94AaEiEU'
    const kp = await Bls12381G2KeyPair.fromFingerprint({
        fingerprint
    })
    expect(kp.fingerprint()).toEqual(fingerprint)
})

it('g1 and g2', async ()=>{
    const k0 = await Bls12381KeyPairs.generate();
    const k1 = await Bls12381KeyPairs.fromFingerprint({
        fingerprint: k0.id.split('#').pop()
    })
    expect(k0.fingerprint()).toEqual(k1.fingerprint())
})