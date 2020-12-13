import React from "react";
import PropTypes from "prop-types";

import Base from "../base/base";
import Grid from "@material-ui/core/Grid";
import {resolver} from "@transmute/did-key.js"

import ContentTypeToggle from '../home/ContentTypeToggle'

import 'brace';
import 'brace/mode/json';
import 'brace/theme/github';


const AceEditor = require('react-ace').default;


export const Resolver = (props) => {
  const [didResolutionResponse, setDidResolutionResponse] = React.useState(null)
  React.useEffect(()=>{
    (async ()=>{
 
      const didResolutionResponse = await resolver.resolve(props.match.params.did, {
        accept: 'application/did+json',
      });
      setDidResolutionResponse(didResolutionResponse);
    })();
  }, [])

  const onToggleRepresentation = async (representation)=>{
    const didResolutionResponse = await resolver.resolve(props.match.params.did, {
      accept: `application/${representation}`,
    });
    setDidResolutionResponse(didResolutionResponse);
  }


  return (
    <Base>
    <Grid container spacing={2}>
      <Grid item xs={12}>
      <ContentTypeToggle
        onClick={(data) => {
          onToggleRepresentation(data);
        }}
      />
      </Grid>
      <Grid item xs={12}>
      {didResolutionResponse ? 
       <AceEditor
       mode={'json'}
       theme="github"
       style={{ width: '100%' }}
       readOnly={true}
       wrapEnabled={true}
       name="Keys"
       value={JSON.stringify(didResolutionResponse, null, 2)}
       editorProps={{ $blockScrolling: true }}
     /> : <div>No did document.</div>}

      </Grid>
    </Grid>
    </Base>
  );
};

Resolver.propTypes = {};
