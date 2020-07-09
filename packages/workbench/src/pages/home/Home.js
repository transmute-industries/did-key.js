import React from "react";
import PropTypes from "prop-types";
import crypto from "crypto";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Base from "../base/base";

import { Ed25519KeyPair, driver } from "@transmute/did-key-ed25519";
import { X25519KeyPair } from "@transmute/did-key-x25519";
import { DIDDocumentPreview, JSONEditor } from "@transmute/material-did-core";

export const Home = (props) => {
  const [state, setState] = React.useState({
    keys: null,
    didDocument: null,
  });
  React.useEffect(() => {
    if (state.keys === null) {
      (async () => {
        const ed25519Key = await Ed25519KeyPair.generate({
          secureRandom: () => {
            return crypto.randomBytes(32);
          },
        });
        const x25519Key = await X25519KeyPair.fromEdKeyPair(ed25519Key);
        const didDocument = driver.keyToDidDoc(ed25519Key);
        setState((state) => {
          return {
            ...state,
            keys: { ed25519Key, x25519Key },
            didDocument,
          };
        });
      })();
    }
  });
  if (!props.wallet) {
    return <div>loading...</div>;
  }
  return (
    <Base>
      <Grid container spacing={4}>
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
