import React from "react";
import PropTypes from "prop-types";

import Base from "../base/base";
import Grid from "@material-ui/core/Grid";
import {resolver} from "@transmute/did-key.js"
import { DIDDocumentPreview } from "@transmute/material-did-core";
import ContentTypeToggle from '../home/ContentTypeToggle'

export const Resolver = (props) => {
  const [didDoc, setDidDoc] = React.useState({})
  React.useEffect(()=>{
    (async ()=>{
 
      const { didDocument } = await resolver.resolve(props.match.params.did, {
        accept: 'application/did+json',
      });
      setDidDoc(didDocument);
    })();
  }, [])

  const onToggleRepresentation = async (representation)=>{
    const { didDocument } = await resolver.resolve(props.match.params.did, {
      accept: `application/${representation}`,
    });
    setDidDoc(didDocument);
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
      {didDoc.id ? <DIDDocumentPreview didDocument={didDoc} /> : <div>No did document.</div>}
      </Grid>
    </Grid>
    </Base>
  );
};

Resolver.propTypes = {};
