import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Base from "../base/base";

import { DIDDocumentPreview, JSONEditor } from "@transmute/material-did-core";

import * as util from "./util";

export const Home = (props) => {
  const [state, setState] = React.useState({
    keys: null,
    didDocument: null,
  });

  const generateEd25519 = async () => {
    (async () => {
      const { keys, didDocument } = await util.generateEd25519();
      setState((state) => {
        return {
          ...state,
          keys,
          didDocument,
        };
      });
    })();
  };

  const generateX25519 = async () => {
    (async () => {
      const { keys, didDocument } = await util.generateX25519();
      setState((state) => {
        return {
          ...state,
          keys,
          didDocument,
        };
      });
    })();
  };

  const generateSecp256k1 = async () => {
    (async () => {
      const { keys, didDocument } = await util.generateSecp256k1();
      setState((state) => {
        return {
          ...state,
          keys,
          didDocument,
        };
      });
    })();
  };

  const generateBls12381 = async () => {
    (async () => {
      const { keys, didDocument } = await util.generateBls12381();
      setState((state) => {
        return {
          ...state,
          keys,
          didDocument,
        };
      });
    })();
  };

  const generateP256 = async () => {
    (async () => {
      const { keys, didDocument } = await util.generateP256();
      setState((state) => {
        return {
          ...state,
          keys,
          didDocument,
        };
      });
    })();
  };

  const generateP384 = async () => {
    (async () => {
      const { keys, didDocument } = await util.generateP384();
      setState((state) => {
        return {
          ...state,
          keys,
          didDocument,
        };
      });
    })();
  };

  const generateP521 = async () => {
    (async () => {
      const { keys, didDocument } = await util.generateP521();
      setState((state) => {
        return {
          ...state,
          keys,
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
              generateX25519();
            }}
          >
            X25519
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
              generateP256();
            }}
          >
            P-256
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
          <Button
            variant={"contained"}
            style={{ marginRight: "8px" }}
            onClick={() => {
              generateP521();
            }}
          >
            P-521
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
