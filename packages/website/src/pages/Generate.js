import React from 'react';
import { withRouter } from 'react-router-dom';

import { Box, Button, Typography } from '@material-ui/core';
import { RepresentationToggleButton } from '../components/RepresentationToggleButton';
import { AceEditor } from '../components/AceEditor';
import { Theme } from '../components/Theme';

import { useHistory } from 'react-router-dom';
import { getSeed, generate, download, convert } from '../utils';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import orange from '@material-ui/core/colors/orange';

const queryString = require('query-string');

const noSupportForSeed = ['secp256r1', 'secp384r1', 'secp521r1'];

const requiresSeed = (type) => {
  return !noSupportForSeed.includes(type);
};

const Page = ({ match }) => {
  const search = queryString.parse(window.location.search);
  const history = useHistory();
  const { type } = match.params;

  const [representation, setRepresentation] = React.useState(
    'application/did+json'
  );
  const [seed, setSeed] = React.useState(search.seed || getSeed());

  const [did, setDid] = React.useState('');

  const [editor, setEditor] = React.useState('');

  const handleNewSeed = () => {
    // console.log('handleNewSeed');
    const value = getSeed();
    setSeed(value);
    return value;
  };

  const handleGenerate = async () => {
    // console.log('handleGenerate');
    const newSeed = handleNewSeed();
    const res = await generate(type, newSeed, representation);
    setDid(res.didDocument.id);
    setEditor(JSON.stringify(res.keys, null, 2));
  };

  const handleRepresentationChange = async (newRepresentation) => {
    if (newRepresentation !== null) {
      // console.log('handleRepresentationChange');
      let res;
      if (requiresSeed(type)) {
        res = await generate(type, seed, newRepresentation);
      } else {
        let keys;
        if (editor === '') {
          res = await generate(type, seed, newRepresentation);
          keys = res.keys;
        } else {
          keys = JSON.parse(editor);
        }
        res = await convert(keys, newRepresentation);
      }
      setDid(res.didDocument.id);
      setEditor(JSON.stringify(res.keys, null, 2));
    }
  };

  const handleDownload = () => {
    // console.log('handleDownload');
    download(`${seed}.${type}.key.json`, editor);
  };

  const handleResolve = () => {
    // console.log('handleResolve');
    history.push(`/${did}`);
  };

  React.useEffect(() => {
    if (!noSupportForSeed.includes(type)) {
      history.push(`?seed=${seed}`);
    }
  }, [type, seed, history]);

  React.useEffect(() => {
    (async () => {
      // console.log(type);
      // console.log(seed);
      // console.log(representation);
      try {
        if (editor === '') {
          const res = await generate(type, seed, representation);
          setDid(res.didDocument.id);
          setEditor(JSON.stringify(res.keys, null, 2));
        }
      } catch (e) {
        // to early
        console.error(e);
      }
    })();
  }, [type, seed, representation, editor]);

  return (
    <Theme>
      <div className="Generate">
        <div style={{ marginBottom: '8px', flexDirection: 'column' }}>
          <Typography style={{ color: orange['500'] }}>
            <Button
              onClick={() => {
                history.push('/');
              }}
              color={'primary'}
              startIcon={<ArrowBackIcon />}
            >
              Home
            </Button>{' '}
            Seeds and keys <strong>must remain private</strong>. Do not share
            them.
          </Typography>
        </div>

        <div style={{ maxWidth: '90%' }}>
          <Box display="flex">
            <Box flexGrow={1}>
              <RepresentationToggleButton
                representation={representation}
                setRepresentation={setRepresentation}
                onChange={handleRepresentationChange}
              />
              <Button style={{ marginLeft: '8px' }} onClick={handleGenerate}>
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
            <Typography variant={'h4'} color={'secondary'} gutterBottom>
              {type} keys
            </Typography>
            <AceEditor value={editor} />
          </div>
        </div>
      </div>
    </Theme>
  );
};

export const Generate = withRouter(Page);
