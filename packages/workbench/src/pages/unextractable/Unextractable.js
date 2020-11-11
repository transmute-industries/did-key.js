import React from "react";
import PropTypes from "prop-types";

import Base from "../base/base";
import { openDB } from 'idb';
import {KeyPair, createDetachedJws} from '@transmute/did-key-web-crypto'

import * as vcjs from "@transmute/vc.js";

import {
  JsonWebKey,
  JsonWebSignature,
} from "@transmute/json-web-signature-2020";
import Room from 'ipfs-pubsub-room'


import credential from './credential.json'
import {documentLoader} from './documentLoader'
import { Typography } from "@material-ui/core";
import {getLibp2p} from './libp2p';

const dbPromise = openDB('keyval-store', 1, {
  upgrade(db) {
    db.createObjectStore('keyval');
  },
});

const idbKeyval = {
  async get(key) {
    return (await dbPromise).get('keyval', key);
  },
  async set(key, val) {
    return (await dbPromise).put('keyval', val, key);
  },
  async delete(key) {
    return (await dbPromise).delete('keyval', key);
  },
  async clear() {
    return (await dbPromise).clear('keyval');
  },
  async keys() {
    return (await dbPromise).getAllKeys('keyval');
  },
};

let peerCredentials = {};
window.peerCredentials = peerCredentials;

export const Unextractable = () => {

  const [yourNode, setYourNode] = React.useState({
  })

  const [observedCredentials, setObservedCredentials] = React.useState({
  })

  React.useEffect(()=>{
    (async ()=>{
      let usableKey  = await idbKeyval.get('myKey')

      if (usableKey === undefined){
        const algorithm = { name: 'ECDSA', namedCurve: 'P-256'}
        const extractable = false;
        // const keyUsages = ['encrypt', 'decrypt', 'sign', 'verify', 'deriveKey', 'deriveBits', 'deriveBits', 'wrapKey', 'unwrapKey'];
        const keyUsages = ['sign', 'verify'];
        const result = await crypto.subtle.generateKey(algorithm, extractable, keyUsages);
        try{
          await crypto.subtle.exportKey('jwk', result.privateKey)
        } catch(e){
          console.info('Expected Unextractable: ', e.message);
        }
        usableKey  = await idbKeyval.set('myKey', result)
      } else {
        // console.log(usableKey)
        // now we have a key to use...
      }

      const publicKeyJwk =  await crypto.subtle.exportKey('jwk', usableKey.publicKey)
      const keyJson = (await KeyPair.from({publicKeyJwk})).toJsonWebKeyPair(false)
      keyJson.id = keyJson.controller + keyJson.id;
      const keypair = await JsonWebKey.from(keyJson)
      
      keypair.signer = ()=> {
        return {
          sign: async ({data}) => {
           
            return createDetachedJws({
              sign: async (data) => {
                const signature = await crypto.subtle.sign(
                  {
                    name: 'ECDSA',
                    hash: { name: 'SHA-256' },
                  },
                  usableKey.privateKey,
                  data
                );
                return signature;
              },
            }, data, { alg: 'ES256', b64: false, crit: ['b64'] });
          },
        }
      };

      if (window.location.hash === ''){
        window.location = '#' + keypair.controller;
      }

      const {libp2p} = await getLibp2p();

      const peerId = libp2p.peerId.toB58String();

       const suite = new JsonWebSignature({
        key: keypair,
        date: credential.issuanceDate,
      });

      const verifiableCredential = await vcjs.ld.issue({
        credential: {
          ...credential,
          issuer: {
            ...credential.issuer,
            id: keypair.controller,
          },
          credentialSubject: {
            ...credential.credentialSubject,
            id: peerId
          }
        },
        suite,
        documentLoader: async (uri) => {
          const res = await documentLoader(uri);
          // uncomment to debug
          // console.log(res);
          return res;
        },
      });

      setYourNode(verifiableCredential)
     

      const room = new Room(libp2p, 'https://did.key.transmute.industries')

      room.on('peer joined', (peer) => {
        console.log('Peer joined the room', peer)
        room.broadcast(Buffer.from(JSON.stringify({type: 'peerIdAssertion', verifiableCredential})))
        
      })
      
      room.on('peer left', (peer) => {
        console.log('Peer left...', peer)
      })
      
      // now started to listen to room
      room.on('subscribed', () => {
        console.log('Now connected!')
      })

      room.on('message', async (message) => {
        const messageJson = JSON.parse(Buffer.from(message.data).toString());
        if (messageJson.type === 'peerIdAssertion'){
          const result = await vcjs.ld.verifyCredential({
            credential: { ...messageJson.verifiableCredential },
            suite: new JsonWebSignature(),
            documentLoader: async (uri) => {
              const res = await documentLoader(uri);
              // uncomment to debug
              // console.log(res);
              return res;
            },
          });
     
          if (result.verified){
            console.log(`\n\nVerified Peer ${JSON.stringify(messageJson.verifiableCredential, null, 2)}`);
            setObservedCredentials( (observedCredentials) => {
              return {...observedCredentials,
                [messageJson.verifiableCredential.credentialSubject.id]: messageJson.verifiableCredential}
            })
          } else {
            console.error(result)
          }
        }
      })     
    })()
  }, [])
  return (
    <Base>
    <Typography>
      WebRTC Demo of Verifiable Credentials and Unextractable Web Crypto DID Key.
    </Typography>

    <Typography variant={'h6'}>
      Your Are:
    </Typography>
      <pre>{JSON.stringify(yourNode, null, 2 )}</pre>
    <Typography variant={'h6'}>
      Your Peers:
    </Typography>
    <pre>{JSON.stringify(observedCredentials, null, 2 )}</pre>
    </Base>
  );
};

Unextractable.propTypes = {};
