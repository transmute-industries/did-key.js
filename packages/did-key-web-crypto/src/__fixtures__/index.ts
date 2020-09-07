import * as types from '../types';

import keypair_fixtures from './keypair.json';
import message_fixtures from './message.json';
import signature_fixtures from './signature.json';
import fingerprint_fixtures from './fingerprint.json';

const keypair_0 = keypair_fixtures.keypair_0 as types.JsonWebKeyPair;
const keypair_1 = keypair_fixtures.keypair_1 as types.Base58KeyPair;

const message_0 = message_fixtures.message_0 as any;
const signature_0 = signature_fixtures.signature_0 as any;
const fingerprint_0 = fingerprint_fixtures.fingerpring_0 as string;

export { keypair_0, keypair_1, message_0, signature_0, fingerprint_0 };
