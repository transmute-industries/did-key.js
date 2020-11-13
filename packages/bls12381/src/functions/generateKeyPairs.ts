import bs58 from 'bs58';
import { generateBls12381G1KeyPair , generateBls12381G2KeyPair} from '@mattrglobal/bbs-signatures';

export const generateKeyPairs = async () =>{
  
    const g1 = await generateBls12381G1KeyPair();
    const g2 = await generateBls12381G2KeyPair();

    const bls12381G1KeyPair = {
        id: "",
        type: "Bls12381G1Key2020",
        controller: "",
        publicKeyBase58: bs58.encode(g1.publicKey),
        privateKeyBase58: bs58.encode(g1.secretKey),
    }

    const bls12381G2KeyPair = {
        id: "",
        type: "Bls12381G2Key2020",
        controller: "",
        publicKeyBase58: bs58.encode(g2.publicKey),
        privateKeyBase58: bs58.encode(g2.secretKey),
    }
    return {
        bls12381G1KeyPair, bls12381G2KeyPair
    }
}