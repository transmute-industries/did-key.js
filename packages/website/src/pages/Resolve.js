import React from 'react';
import { withRouter } from 'react-router-dom';

import { Grid, Button, Typography } from '@material-ui/core';
import { RepresentationToggleButton } from '../components/RepresentationToggleButton';
import { AceEditor } from '../components/AceEditor';
import { Theme } from '../components/Theme';

import { resolve, download } from '../utils';
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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
          <Typography>
            <Button
              color={'primary'}
              onClick={() => {
                history.push('/');
              }}
              startIcon={<ArrowBackIcon />}
            >
              Home
            </Button>
          </Typography>
        </div>

        <Grid container>
          <Grid item>
            <div style={{ marginBottom: '16px' }}>
              <RepresentationToggleButton
                representation={representation}
                setRepresentation={setRepresentation}
              />
            </div>
          </Grid>
          <Grid item>
            <Button
              color={'secondary'}
              variant={'outlined'}
              onClick={handleDownload}
              style={{ marginLeft: '8px' }}
            >
              Download
            </Button>{' '}
          </Grid>
        </Grid>

        <div style={{ marginTop: '16px' }}>
          <Typography
            variant={'h4'}
            color={'secondary'}
            style={{ marginBottom: '32px' }}
          >
            DID Document
          </Typography>

          <AceEditor value={editor} />
        </div>
      </div>
    </Theme>
  );
};

export const Resolve = withRouter(Page);
