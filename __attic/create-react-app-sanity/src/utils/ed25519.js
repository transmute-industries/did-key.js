import {Ed25519KeyPair} from '@transmute/did-key-ed25519'
import crypto from 'crypto'
import { Ed25519Signature2018 } from '@transmute/ed25519-signature-2018';
import { ld as vc } from '@transmute/vc.js';
import { documentLoader } from './documentLoader';


export const ed25519 = async () =>{

    const key = await Ed25519KeyPair.generate({
        secureRandom: ()=>{
            return crypto.randomBytes(32)
        }
    });
    key.id = key.controller + key.id;

    const verifiableCredential = await vc.issue({
        credential: {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
          ],
          id: 'https://example.com/123',
          type: ['VerifiableCredential'],
          issuer: {
            id: key.controller,
           
          },
          issuanceDate: '2020-03-10T04:24:12.164Z',
          expirationDate: '2029-03-10T04:24:12.164Z',
          credentialSubject: {
            id: 'did:example:123',
          },
        },
        suite: new Ed25519Signature2018({
          key,
        }),
        documentLoader,
      });
    
      const result = await vc.verifyCredential({
        credential: verifiableCredential,
        suite: new Ed25519Signature2018(),
        documentLoader,
      });

 
    return {
        json: key.toJsonWebKeyPair(true),
        ld: key.toKeyPair(true),
        verified: result.verified,
        verifiableCredential
    }
}