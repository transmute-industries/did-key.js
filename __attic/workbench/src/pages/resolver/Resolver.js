import React from 'react';

import Base from '../base/base';
import Grid from '@material-ui/core/Grid';
import { resolver } from '@transmute/did-key.js';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

import borc from 'borc';

const AceEditor = require('react-ace').default;

export const Resolver = (props) => {
  const [contentType, setContentType] = React.useState('application/did+json');
  const [didResolutionResponse, setDidResolutionResponse] = React.useState(
    null
  );
  React.useEffect(() => {
    (async () => {
      const didResolutionResponse = await resolver.resolve(
        props.match.params.did,
        {
          accept: 'application/did+json',
        }
      );
      setDidResolutionResponse(didResolutionResponse);
    })();
  }, []);

  const onToggleRepresentation = async (newContentType) => {
    if (newContentType) {
      setContentType(newContentType);

      if (newContentType === 'application/did+cbor') {
        const didResolutionResponse = await resolver.resolve(
          props.match.params.did,
          {
            accept: 'application/did+ld+json',
          }
        );
        setDidResolutionResponse(borc.encode(didResolutionResponse));
      } else {
        const didResolutionResponse = await resolver.resolve(
          props.match.params.did,
          {
            accept: newContentType,
          }
        );
        setDidResolutionResponse(didResolutionResponse);
      }
    }
  };

  return (
    <Base>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ToggleButtonGroup
            value={contentType}
            exclusive
            onChange={(event, newContentType) => {
              onToggleRepresentation(newContentType);
            }}
            aria-label="did document representation"
          >
            <ToggleButton value="application/did+json" aria-label="json">
              did+json
            </ToggleButton>
            <ToggleButton value="application/did+ld+json" aria-label="jsonld">
              did+ld+json
            </ToggleButton>
            <ToggleButton value="application/did+cbor" aria-label="cbor">
              did+cbor
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12}>
          {didResolutionResponse ? (
            <AceEditor
              mode={'json'}
              theme="github"
              style={{ width: '100%' }}
              readOnly={true}
              wrapEnabled={true}
              name="Keys"
              value={JSON.stringify(didResolutionResponse, null, 2)}
              editorProps={{ $blockScrolling: true }}
            />
          ) : (
            <div>No did document.</div>
          )}
        </Grid>
      </Grid>
    </Base>
  );
};

Resolver.propTypes = {};
