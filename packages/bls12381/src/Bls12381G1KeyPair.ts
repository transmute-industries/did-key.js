
import bs58 from 'bs58'
import base64url from 'base64url'
import * as mattr from '@mattrglobal/bls12381-key-pair'
import {generateKeyPairs} from './functions/generateKeyPairs';
import {toJsonWebKeyPair} from './functions/toJsonWebKeyPair';
import {publicKeyJwkToDidKey} from './functions/publicKeyJwkToDidKey';
import {fingerprintToJsonWebKeyPair} from './functions/fingerprintToJsonWebKeyPair'

export class Bls12381G1KeyPair {
  public id: string;
  public type: string = 'Bls12381G1Key2020';
  public controller: string;
  public publicKeyBuffer: Buffer;
  public privateKeyBuffer?: Buffer;

  static async generate() {
    const { bls12381G1KeyPair } = await generateKeyPairs();
    const {publicKeyJwk} = toJsonWebKeyPair(bls12381G1KeyPair)
    bls12381G1KeyPair.controller = publicKeyJwkToDidKey(publicKeyJwk)
    bls12381G1KeyPair.id = '#' + bls12381G1KeyPair.controller.split('did:key:').pop();
    return new Bls12381G1KeyPair({
      id: bls12381G1KeyPair.id,
      controller: bls12381G1KeyPair.controller,
      publicKeyBuffer: bs58.decode(bls12381G1KeyPair.publicKeyBase58),
      privateKeyBuffer: bs58.decode(bls12381G1KeyPair.privateKeyBase58)
    })
  }

  static async fromFingerprint({ fingerprint }: any) {
    const {bls12381G1KeyPair} = fingerprintToJsonWebKeyPair(fingerprint)
    return new Bls12381G1KeyPair({
      id: bls12381G1KeyPair.id,
      controller: bls12381G1KeyPair.controller,
      publicKeyBuffer: base64url.toBuffer(bls12381G1KeyPair.publicKeyJwk.x)
    });
  }

  static async from(options: any) {

    if (options.type === 'JsonWebKey2020'){
      let opts: any = {
        id: options.id,
        controller: options.controller,
        publicKeyBuffer: base64url.toBuffer(options.publicKeyJwk.x)
      }
      if (options.privateKeyJwk){
        opts.privateKeyBuffer = base64url.toBuffer(options.privateKeyJwk.d)
      }
      return new Bls12381G1KeyPair(opts);
    }

    if (options.type === 'Bls12381G1Key2020'){
      let opts: any = {
        id: options.id,
        controller: options.controller,
        publicKeyBuffer: bs58.decode(options.publicKeyBase58)
      }
      if (options.privateKeyBase58){
        opts.privateKeyBuffer = bs58.decode(options.privateKeyBase58)
      }
      return new Bls12381G1KeyPair(opts);
    }

    throw new Error('unsuported key type')
    
  }

  constructor(options: any) {
    this.id = options.id;
    this.controller = options.controller;
    this.publicKeyBuffer = options.publicKeyBuffer;
    this.privateKeyBuffer = options.privateKeyBuffer;
    if (!this.controller){
      const { publicKeyJwk } = this.toJsonWebKeyPair(false);
      this.controller = publicKeyJwkToDidKey(publicKeyJwk);
      
    }
    if (!this.id){
      const { publicKeyJwk } = this.toJsonWebKeyPair(false);
      this.id = '#' + publicKeyJwkToDidKey(publicKeyJwk).split('did:key:').pop();
      
    }
    
  }

  fingerprint(){
    const { publicKeyJwk } = this.toJsonWebKeyPair(false);
    return publicKeyJwkToDidKey(publicKeyJwk).split('did:key:').pop()
  }

  toKeyPair(exportPrivateKey: boolean = false) {
    const kp: any = {
      id: this.id,
      type: this.type,
      controller: this.controller,
      publicKeyBase58: bs58.encode(this.publicKeyBuffer),
    };

    if (exportPrivateKey) {
      kp.privateKeyBase58 = bs58.encode(this.privateKeyBuffer);
    }

    return kp;
  }

  toJsonWebKeyPair(exportPrivateKey = false) {
    const result = toJsonWebKeyPair(this.toKeyPair(exportPrivateKey))
    return result
  }

  verifier() {
    const key = new mattr.Bls12381G1KeyPair({
      publicKeyBase58: bs58.encode(this.publicKeyBuffer),
    });
   return key.verifier()
  }

  signer() {
    const key = new mattr.Bls12381G1KeyPair({
      publicKeyBase58: bs58.encode(this.publicKeyBuffer),
      privateKeyBase58: bs58.encode(this.privateKeyBuffer)
    });
   return key.signer()
  }
}
