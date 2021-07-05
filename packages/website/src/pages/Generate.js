import React from 'react';
import { withRouter } from 'react-router-dom';

import { Box, Button } from '@material-ui/core';
import { RepresentationToggleButton } from '../components/RepresentationToggleButton';
import { AceEditor } from '../components/AceEditor';
import { Theme } from '../components/Theme';

import { useHistory } from 'react-router-dom';
import { getSeed, generate, download } from '../utils';

const queryString = require('query-string');

const noSupportForSeed = ['secp256r1', 'secp384r1', 'secp521r1'];

const Page = ({ match }) => {
  const search = queryString.parse(window.location.search);
  const history = useHistory();
  const { type } = match.params;

  const [did, setDid] = React.useState('');

  const [representation, setRepresentation] = React.useState(
    'application/did+json'
  );

  const [seed, setSeed] = React.useState(search.seed || '');

  const [editor, setEditor] = React.useState('');

  const handleNewSeed = React.useCallback(() => {
    const value = getSeed();
    setSeed(value);
    if (!noSupportForSeed.includes(type)) {
      history.push(`?seed=${value}`);
    }
  }, [history, type, setSeed]);

  const handleGenerate = React.useCallback(async () => {
    const res = await generate(type, seed, representation);
    setDid(res.didDocument.id);
    setEditor(JSON.stringify(res.keys, null, 2));
  }, [type, seed, representation]);

  const handleDownload = React.useCallback(async () => {
    download(`${seed}.${type}.key.json`, editor);
  }, [type, seed, editor]);

  const handleResolve = React.useCallback(async () => {
    history.push(`/${did}`);
  }, [history, did]);

  React.useEffect(() => {
    if (seed === '') {
      handleNewSeed();
    }
  }, [type, seed, handleNewSeed]);

  React.useEffect(() => {
    if (seed !== '') {
      (async () => {
        await handleGenerate();
      })();
    }
  }, [seed, handleGenerate]);

  return (
    <Theme>
      <div className="Generate">
        <div style={{ marginBottom: '8px' }}>
          <Button
            onClick={() => {
              history.push('/');
            }}
            color={'primary'}
          >
            Home
          </Button>
        </div>

        <div style={{ maxWidth: '90%' }}>
          <Box display="flex">
            <Box flexGrow={1}>
              <RepresentationToggleButton
                representation={representation}
                setRepresentation={setRepresentation}
              />
              <Button style={{ marginLeft: '8px' }} onClick={handleNewSeed}>
                Re-generate
              </Button>
              <Button style={{ marginLeft: '8px' }} onClick={handleDownload}>
                Download
              </Button>
            </Box>
            <Box>
              <Button
                color={'secondary'}
                variant={'outlined'}
                onClick={handleResolve}
              >
                Resolve
              </Button>
            </Box>
          </Box>
          <div style={{ marginTop: '16px' }}>
            <AceEditor value={editor} />
          </div>
        </div>
      </div>
    </Theme>
  );
};

export const Generate = withRouter(Page);
