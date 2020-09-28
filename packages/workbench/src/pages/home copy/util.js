import crypto from "crypto";
import * as ed25519 from "@transmute/did-key-ed25519";
import * as x25519 from "@transmute/did-key-x25519";
import * as secp256k1 from "@transmute/did-key-secp256k1";
import * as bls12381 from "@transmute/did-key-bls12381";
import * as didKeyWebCrypto from "@transmute/did-key-web-crypto";

export const generateEd25519 = async () => {
  const ed25519Key = await ed25519.Ed25519KeyPair.generate({
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  });
  const { didDocument } = await ed25519.driver.resolve(ed25519Key.controller);
  return {
    keys: {
      ed25519: await ed25519Key.toKeyPair(true),
      x25519: (
        await x25519.X25519KeyPair.fromEdKeyPair(
          await ed25519Key.toKeyPair(true)
        )
      ).toKeyPair(true),
    },
    didDocument,
  };
};

export const generateX25519 = async () => {
  const x25519KeyPair = await x25519.X25519KeyPair.generate({
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  });
  const { didDocument } = await x25519.driver.resolve(x25519KeyPair.controller);
  return {
    keys: {
      key: x25519KeyPair.toKeyPair(true),
    },
    didDocument,
  };
};

export const generateSecp256k1 = async () => {
  const secp256k1Key = await secp256k1.Secp256k1KeyPair.generate({
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  });
  const keys = {
    key: secp256k1Key.toKeyPair(true),
  };
  const { didDocument } = await secp256k1.driver.resolve(keys.key.controller);
  return {
    keys,
    didDocument,
  };
};

export const generateBls12381 = async () => {
  const bls12381G2Key = await bls12381.Bls12381G2KeyPair.generate();
  // const didDocument = bls12381.driver.keyToDidDoc(bls12381G2Key);
  const keys = {
    key: await bls12381.Bls12381G2KeyPair.toKeyPair(bls12381G2Key),
  };
  return {
    keys,
    // didDocument,
  };
};

export const generateP256 = async () => {
  const keypair = await didKeyWebCrypto.KeyPair.generate({
    kty: "EC",
    crvOrSize: "P-256",
  });
  const keys = {
    key: await keypair.toJsonWebKeyPair(true),
  };
  const { didDocument } = await didKeyWebCrypto.driver.resolve(
    keys.key.controller
  );
  return {
    keys,
    didDocument,
  };
};

export const generateP384 = async () => {
  const keypair = await didKeyWebCrypto.KeyPair.generate({
    kty: "EC",
    crvOrSize: "P-384",
  });
  const keys = {
    key: await keypair.toJsonWebKeyPair(true),
  };
  const { didDocument } = await didKeyWebCrypto.driver.resolve(
    keys.key.controller
  );
  return {
    keys,
    didDocument,
  };
};

export const generateP521 = async () => {
  const keypair = await didKeyWebCrypto.KeyPair.generate({
    kty: "EC",
    crvOrSize: "P-521",
  });
  const keys = {
    key: await keypair.toJsonWebKeyPair(true),
  };
  const { didDocument } = await didKeyWebCrypto.driver.resolve(
    keys.key.controller
  );
  return {
    keys,
    didDocument,
  };
};
