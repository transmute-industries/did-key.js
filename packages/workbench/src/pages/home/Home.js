import React from "react";

import PropTypes from "prop-types";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

import Base from "../base/base";
import {
    generateEd25519,
    generateX25519,
    generateSecp256k1,
    generateBls12381,
    generateP256,
    generateP384,
    generateP521,
  } from "./util";


const AceEditor = require('react-ace').default;


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
      name: "bls12381",
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

  const Panel = ({handleGenerate, keys, resolutionResponse, contentType, handleContentTypeChange}) => {
 
    return (
      <Grid container spacing={4}>
        <Grid item sm={12} xs={12}>
          <Box display="flex">
            <Box flexGrow={1}>
             
      <ToggleButtonGroup
      value={contentType}
      exclusive
      onChange={(event, newContentType) => {
        handleContentTypeChange(newContentType);
      }}
      aria-label="did document representation"
    >
      <ToggleButton
        value="application/did+json"
        aria-label="json"
      >
        did+json
      </ToggleButton>
      <ToggleButton
        value="application/did+ld+json"
        aria-label="jsonld"
      >
        did+ld+json
      </ToggleButton>
      <ToggleButton value="application/did+cbor" aria-label="cbor">
        did+cbor
      </ToggleButton>
    </ToggleButtonGroup>
  
            </Box>
            <Box>
              <Button
                variant={"contained"}
                color={"secondary"}
                onClick={() => {
                  handleGenerate();
                }}
              >
                Generate
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item sm={12} xs={12}>
            <Typography variant={"h6"} gutterBottom>
              Resolution
            </Typography>
            <AceEditor
      mode={'json'}
      theme="github"
      style={{ width: '100%' }}
      readOnly={true}
      wrapEnabled={true}
      name="DID Document Representation"
      value={JSON.stringify(resolutionResponse, null, 2)}
      editorProps={{ $blockScrolling: true }}
    />
          </Grid>
        <Grid item sm={12} xs={12}>
          <Typography variant={"h6"} gutterBottom>
            Key
          </Typography>
          <AceEditor
      mode={'json'}
      theme="github"
      style={{ width: '100%' }}
      readOnly={true}
      wrapEnabled={true}
      name="Keys"
      value={JSON.stringify(keys, null, 2)}
      editorProps={{ $blockScrolling: true }}
    />
        </Grid>
      </Grid>
    );
  };
export const Home = () => {
    const classes = useStyles();
    const [contentType, setContentType] = React.useState("application/did+json");
    const [keys, setKeys] = React.useState(null);
    const [resolutionResponse, setResolutionResponse] = React.useState(null);
    
    const [tabValue, tabTabValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      tabTabValue(newValue);
    };

    const handleContentTypeChange = async (newContentType)=>{
      if (newContentType){
        setContentType(newContentType);
        const refresh = options[tabValue].refresh;
        const result = await refresh(keys, newContentType);
        setKeys(result.keys);
        setResolutionResponse(result.resolutionResponse)
      }
    }

    const handleGenerate = async (index=tabValue) => {
        const refresh = options[index].refresh;
        const result = await refresh(null, contentType);
        setKeys(result.keys);
        setResolutionResponse(result.resolutionResponse);
      };
    
      React.useEffect(() => {
        if (keys === null){
          (async () => {
            handleGenerate(0);
          })();
        }
      }, []);
  return (
    <Base>
     <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tabValue}
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
            value={tabValue}
            index={opt.index}
            style={{ width: "100%" }}
          >
            <Panel handleGenerate={handleGenerate} keys={keys} resolutionResponse={resolutionResponse} contentType={contentType} handleContentTypeChange={handleContentTypeChange}/>
          </TabPanel>
        );
      })}
    </div>
    
    </Base>
  );
};

