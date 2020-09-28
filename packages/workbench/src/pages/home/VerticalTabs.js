import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ContentTypeToggle from "./ContentTypeToggle";
import { DIDDocumentPreview, JSONEditor } from "@transmute/material-did-core";

import {
  generateEd25519,
  generateX25519,
  generateSecp256k1,
  generateBls12381,
  generateP256,
  generateP384,
  generateP521,
} from "./util";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const Panel = ({ keys, didDocument, onToggleRepresentation, onGenerate }) => {
  return (
    <Grid container spacing={4}>
      <Grid item sm={12} xs={12}>
        <Box display="flex">
          <Box flexGrow={1}>
            <ContentTypeToggle
              onClick={(data) => {
                onToggleRepresentation(data);
              }}
            />
          </Box>
          <Box>
            <Button
              variant={"contained"}
              color={"secondary"}
              onClick={() => {
                onGenerate();
              }}
            >
              Generate
            </Button>
          </Box>
        </Box>
      </Grid>
      {didDocument !== null && (
        <Grid item sm={12} xs={12}>
          <Typography variant={"h6"} gutterBottom>
            DID Document
          </Typography>
          <DIDDocumentPreview didDocument={didDocument} />
        </Grid>
      )}
      <Grid item sm={12} xs={12}>
        <Typography variant={"h6"} gutterBottom>
          Key
        </Typography>
        <JSONEditor value={JSON.stringify(keys, null, 2)} />
      </Grid>
    </Grid>
  );
};

export default function VerticalTabs() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    contentType: "application/did+json",
    keys: null,
    didDocument: null,
  });
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const options = [
    {
      index: 0,
      name: "ed25519",
      refresh: generateEd25519,
    },
    {
      index: 1,
      name: "x25519",
      refresh: generateX25519,
    },
    {
      index: 2,
      name: "secp256k1",
      refresh: generateSecp256k1,
    },
    {
      index: 3,
      name: "bls12381 g2",
      refresh: generateBls12381,
    },
    {
      index: 4,
      name: "P-256",
      refresh: generateP256,
    },
    {
      index: 5,
      name: "P-384",
      refresh: generateP384,
    },
    {
      index: 6,
      name: "P-521",
      refresh: generateP521,
    },
  ];

  const handleGenerate = async (index) => {
    const refresh = options[index].refresh;
    const { keys, didDocument } = await refresh(null, state.contentType);
    setState({
      ...state,
      keys,
      didDocument,
    });
  };

  React.useEffect(() => {
    (async () => {
      handleGenerate(0);
    })();
  }, []);

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="DID Types"
        className={classes.tabs}
      >
        {options.map((opt) => {
          return (
            <Tab
              key={opt.index}
              label={opt.name}
              {...a11yProps(opt.index)}
              onClick={() => {
                handleGenerate(opt.index);
              }}
            />
          );
        })}
      </Tabs>
      {options.map((opt) => {
        return (
          <TabPanel
            key={opt.index}
            value={value}
            index={opt.index}
            style={{ width: "100%" }}
          >
            <Panel
              didDocument={state.didDocument}
              keys={state.keys}
              onToggleRepresentation={async (contentType) => {
                const refresh = options[opt.index].refresh;
                const { keys, didDocument } = await refresh(
                  state.keys,
                  `application/${contentType}`
                );
                setState({
                  contentType: `application/${contentType}`,
                  keys,
                  didDocument,
                });
              }}
              onGenerate={async () => {
                handleGenerate(opt.index);
              }}
            />
          </TabPanel>
        );
      })}
    </div>
  );
}
