import React from "react";
import PropTypes from "prop-types";
import crypto from "crypto";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Base from "../base/base";
import * as bs58 from "bs58";
import * as ed25519 from "@transmute/did-key-ed25519";
import * as x25519 from "@transmute/did-key-x25519";
import * as secp256k1 from "@transmute/did-key-secp256k1";
import * as bls12381 from "@transmute/did-key-bls12381";
import * as p384 from "@transmute/did-key-p384";
import { DIDDocumentPreview, JSONEditor } from "@transmute/material-did-core";

export const Home = (props) => {
  const [state, setState] = React.useState({
    keys: null,
    didDocument: null,
  });

  const generateEd25519 = async () => {
    (async () => {
      const ed25519Key = await ed25519.Ed25519KeyPair.generate({
        secureRandom: () => {
          return crypto.randomBytes(32);
        },
      });
      const x25519Key = await x25519.X25519KeyPair.fromEdKeyPair(ed25519Key);
      const didDocument = ed25519.driver.keyToDidDoc(ed25519Key);
      setState((state) => {
        return {
          ...state,
          keys: { ed25519Key, x25519Key },
          didDocument,
        };
      });
    })();
  };

  const generateSecp256k1 = async () => {
    (async () => {
      const secp256k1Key = await secp256k1.Secp256k1KeyPair.generate({
        secureRandom: () => {
          return crypto.randomBytes(32);
        },
      });
      const didDocument = secp256k1.driver.keyToDidDoc(secp256k1Key);
      setState((state) => {
        return {
          ...state,
          keys: { secp256k1Key },
          didDocument,
        };
      });
    })();
  };

  const generateBls12381 = async () => {
    (async () => {
      const bls12381G2Key = await bls12381.Bls12381G2KeyPair.generate();
      const didDocument = bls12381.driver.keyToDidDoc(bls12381G2Key);
      setState((state) => {
        return {
          ...state,
          keys: {
            bls12381G2Key: {
              ...didDocument.publicKey[0],
              privateKeyBase58: bs58.encode(bls12381G2Key.privateKeyBuffer),
            },
          },
          didDocument,
        };
      });
    })();
  };

  const generateP384 = async () => {
    (async () => {
      const p384Key = await p384.P384KeyPair.generate();
      const didDocument = p384.driver.keyToDidDoc(p384Key);
      const privateKeyJwk = p384Key.toJwk(true);
      delete privateKeyJwk.kid;
      setState((state) => {
        return {
          ...state,
          keys: {
            p384Key: {
              ...didDocument.publicKey[0],
              privateKeyJwk,
            },
          },
          didDocument,
        };
      });
    })();
  };

  React.useEffect(() => {
    if (state.keys === null) {
      generateEd25519();
    }
  });
  if (!props.wallet) {
    return <div>loading...</div>;
  }
  return (
    <Base>
      <Grid container spacing={4}>
        <Grid item sm={12} xs={12}>
          <Button
            variant={"contained"}
            style={{ marginRight: "8px" }}
            onClick={() => {
              generateEd25519();
            }}
          >
            Ed25519
          </Button>

          <Button
            variant={"contained"}
            style={{ marginRight: "8px" }}
            onClick={() => {
              generateSecp256k1();
            }}
          >
            Secp256k1
          </Button>
          <Button
            variant={"contained"}
            style={{ marginRight: "8px" }}
            onClick={() => {
              generateBls12381();
            }}
          >
            Bls12381
          </Button>

          <Button
            variant={"contained"}
            style={{ marginRight: "8px" }}
            onClick={() => {
              generateP384();
            }}
          >
            P-384
          </Button>
        </Grid>

        {state.didDocument !== null && (
          <Grid item sm={12} xs={12}>
            <Typography variant={"h6"} gutterBottom>
              DID Document
            </Typography>
            <DIDDocumentPreview didDocument={state.didDocument} />
          </Grid>
        )}
        <Grid item sm={12} xs={12}>
          <Typography variant={"h6"} gutterBottom>
            Key
          </Typography>
          <JSONEditor value={JSON.stringify(state.keys, null, 2)} />
        </Grid>
      </Grid>
    </Base>
  );
};

Home.propTypes = {
  wallet: PropTypes.any,
};
