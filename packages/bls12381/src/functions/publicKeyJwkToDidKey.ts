import bs58 from 'bs58'
import base64url from 'base64url'
import { MULTIBASE_ENCODED_BASE58_IDENTIFIER, BLS12381G1_MULTICODEC_IDENTIFIER, BLS12381G2_MULTICODEC_IDENTIFIER, VARIABLE_INTEGER_TRAILING_BYTE } from '../constants'
import { BlsCurveName } from '../types'

const curveToMulticodecMap: any = {
    [BlsCurveName.G1]: BLS12381G1_MULTICODEC_IDENTIFIER,
    [BlsCurveName.G2]: BLS12381G2_MULTICODEC_IDENTIFIER,
}

export const publicKeyJwkToDidKey = (publicKeyJwk:any)=>{

    const publicKey = base64url.toBuffer(publicKeyJwk.x);
    
    const buffer = new Uint8Array(2 + publicKey.length);
    buffer[0] = curveToMulticodecMap[publicKeyJwk.crv];
    buffer[1] = VARIABLE_INTEGER_TRAILING_BYTE;

    buffer.set(publicKey, 2);

    return `did:key:${MULTIBASE_ENCODED_BASE58_IDENTIFIER}${bs58.encode(buffer)}`
}