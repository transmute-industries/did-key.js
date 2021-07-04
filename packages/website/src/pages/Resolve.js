import React from 'react';
import { withRouter } from 'react-router-dom';

import { Box, Button } from '@material-ui/core';
import { RepresentationToggleButton } from '../components/RepresentationToggleButton';
import { AceEditor } from '../components/AceEditor';
import { Theme } from '../components/Theme';

import { resolve, download } from '../utils';
import { useHistory } from 'react-router-dom';

const Page = ({ match }) => {
  const { did } = match.params;
  const history = useHistory();

  const [representation, setRepresentation] = React.useState(
    'application/did+json'
  );

  const [editor, setEditor] = React.useState('');

  const handleDownload = React.useCallback(async () => {
    download(`${did.split(':').pop()}.did-key.json`, editor);
  }, [did, editor]);

  const handleResolve = React.useCallback(async () => {
    const { didDocument } = await resolve(did, representation);
    setEditor(JSON.stringify(didDocument, null, 2));
  }, [did, representation]);

  React.useEffect(() => {
    (async () => {
      await handleResolve();
    })();
  }, [handleResolve]);

  return (
    <Theme>
      <div className="Resolve">
        <div style={{ marginBottom: '8px' }}>
          <Button
            color={'primary'}
            onClick={() => {
              history.push('/');
            }}
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
            </Box>
            <Box>
              <Button
                color={'primary'}
                variant={'contained'}
                onClick={handleDownload}
              >
                Download
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

export const Resolve = withRouter(Page);
