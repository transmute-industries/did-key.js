import crypto from "crypto";
import * as ed25519 from "@transmute/did-key-ed25519";
import * as x25519 from "@transmute/did-key-x25519";
import * as secp256k1 from "@transmute/did-key-secp256k1";
import * as bls12381 from "@transmute/did-key-bls12381";
import * as didKeyWebCrypto from "@transmute/did-key-web-crypto";

export const generateEd25519 = async (keys, contentType) => {
  let _keys = keys;
  let ed25519Key;
  let x25519Key;
  if (keys !== null) {
    ed25519Key = await ed25519.Ed25519KeyPair.from(_keys.ed25519);
    x25519Key = await x25519.X25519KeyPair.from(_keys.x25519);
  } else {
    ed25519Key = await ed25519.Ed25519KeyPair.generate({
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    });
    x25519Key = await x25519.X25519KeyPair.fromEdKeyPair(
      await ed25519Key.toKeyPair(true)
    );
  }
  _keys = {
    ed25519:
      contentType === "application/did+ld+json"
        ? await ed25519Key.toKeyPair(true)
        : await ed25519Key.toJsonWebKeyPair(true),
    x25519:
      contentType === "application/did+ld+json"
        ? await x25519Key.toKeyPair(true)
        : await x25519Key.toJsonWebKeyPair(true),
  };
  const { didDocument } = await ed25519.driver.resolve(
    _keys.ed25519.controller,
    {
      accept: contentType,
    }
  );
  return {
    keys: _keys,
    didDocument,
  };
};

export const generateX25519 = async (keys, contentType) => {
  let _keys = keys;
  let keyPair;
  if (_keys !== null) {
    keyPair = await x25519.X25519KeyPair.from(keys.key);
  } else {
    keyPair = await x25519.X25519KeyPair.generate({
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    });
  }
  _keys = {
    key:
      contentType === "application/did+ld+json"
        ? await keyPair.toKeyPair(true)
        : await keyPair.toJsonWebKeyPair(true),
  };
  const { didDocument } = await x25519.driver.resolve(_keys.key.controller, {
    accept: contentType,
  });
  return {
    keys: _keys,
    didDocument,
  };
};

export const generateSecp256k1 = async (keys, contentType) => {
  let _keys = keys;
  let keyPair;
  if (_keys !== null) {
    keyPair = await secp256k1.Secp256k1KeyPair.from(keys.key);
  } else {
    keyPair = await secp256k1.Secp256k1KeyPair.generate({
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    });
  }
  _keys = {
    key:
      contentType === "application/did+ld+json"
        ? await keyPair.toKeyPair(true)
        : await keyPair.toJsonWebKeyPair(true),
  };
  const { didDocument } = await secp256k1.driver.resolve(_keys.key.controller, {
    accept: contentType,
  });
  return {
    keys: _keys,
    didDocument,
  };
};

export const generateBls12381 = async (keys, contentType) => {
  let _keys = keys;
  let keyPair;
  if (_keys !== null) {
    keyPair = await bls12381.Bls12381G2KeyPair.from(keys.key);
  } else {
    keyPair = await bls12381.Bls12381G2KeyPair.generate();
  }
  _keys = {
    key:
      contentType === "application/did+ld+json"
        ? await keyPair.toKeyPair(true)
        : await keyPair.toJsonWebKeyPair(true),
  };
  const { didDocument } = await bls12381.driver.resolve(_keys.key.controller, {
    accept: contentType,
  });
  return {
    keys: _keys,
    didDocument,
  };
};

export const generateP256 = async (keys, contentType) => {
  let _keys = keys;
  let keyPair;
  if (_keys !== null) {
    keyPair = await didKeyWebCrypto.KeyPair.from(keys.key);
  } else {
    keyPair = await didKeyWebCrypto.KeyPair.generate({
      kty: "EC",
      crvOrSize: "P-256",
    });
  }
  _keys = {
    key:
      contentType === "application/did+ld+json"
        ? await keyPair.toKeyPair(true)
        : await keyPair.toJsonWebKeyPair(true),
  };
  const { didDocument } = await didKeyWebCrypto.driver.resolve(
    _keys.key.controller,
    {
      accept: contentType,
    }
  );
  return {
    keys: _keys,
    didDocument,
  };
};

export const generateP384 = async (keys, contentType) => {
  let _keys = keys;
  let keyPair;
  if (_keys !== null) {
    keyPair = await didKeyWebCrypto.KeyPair.from(keys.key);
  } else {
    keyPair = await didKeyWebCrypto.KeyPair.generate({
      kty: "EC",
      crvOrSize: "P-384",
    });
  }
  _keys = {
    key:
      contentType === "application/did+ld+json"
        ? await keyPair.toKeyPair(true)
        : await keyPair.toJsonWebKeyPair(true),
  };
  const { didDocument } = await didKeyWebCrypto.driver.resolve(
    _keys.key.controller,
    {
      accept: contentType,
    }
  );
  return {
    keys: _keys,
    didDocument,
  };
};

export const generateP521 = async (keys, contentType) => {
  let _keys = keys;
  let keyPair;
  if (_keys !== null) {
    keyPair = await didKeyWebCrypto.KeyPair.from(keys.key);
  } else {
    keyPair = await didKeyWebCrypto.KeyPair.generate({
      kty: "EC",
      crvOrSize: "P-521",
    });
  }
  _keys = {
    key:
      contentType === "application/did+ld+json"
        ? await keyPair.toKeyPair(true)
        : await keyPair.toJsonWebKeyPair(true),
  };
  const { didDocument } = await didKeyWebCrypto.driver.resolve(
    _keys.key.controller,
    {
      accept: contentType,
    }
  );
  return {
    keys: _keys,
    didDocument,
  };
};
