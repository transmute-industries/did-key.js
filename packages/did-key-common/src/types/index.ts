/* class decorator */
export const staticImplements = <T>() => {
  return <U extends T>(constructor: U) => {
    return constructor;
  };
};

export * from './JWE_ALG';
export * from './JWS_ALG';

export * from './KeyPairClass';
export * from './KeyPairInstance';
export * from './KeyAgreementKeyPairClass';
export * from './KeyPairGenerateOptions';
export * from './EpkResult';
export * from './KeyEncryptionKeyFromEphemeralPublicKeyOptions';
export * from './KeyEncryptionKeyFromStaticPublicKeyOptions';
export * from './DeriveSecretOptions';

export * from './KeyPairBase';

export * from './KeyPairJwk';
export * from './JsonWebKeyPair';

export * from './KeyPairBase58';
export * from './LinkedDataKeyPair';

export * from './KeyAgreementKeyPairInstance';
