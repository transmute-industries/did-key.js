import {X25519KeyPair} from '@transmute/did-key-x25519'
import crypto from 'crypto'
export const x25519 = async () =>{
    const key = await X25519KeyPair.generate({
        secureRandom: ()=>{
            return crypto.randomBytes(32)
        }
    });
    return {
        json: key.toJsonWebKeyPair(true),
        ld: key.toKeyPair(true)
    }
}