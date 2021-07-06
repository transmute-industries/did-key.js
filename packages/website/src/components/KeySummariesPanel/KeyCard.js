import React from 'react';
import { Paper, Typography, Button } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.dark,
    padding: '32px',
    textAlign: 'center',
  },
  title: {
    color: theme.palette.text.primary,
  },
  description: {
    color: theme.palette.text.secondary,
    padding: '8px 0px',
    marginTop: '12px',
    minHeight: '96px',
  },
}));

export const KeyCard = ({ data }) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Paper className={classes.root}>
      <Typography className={classes.title} variant={'h3'}>
        {data.name}
      </Typography>
      <Typography className={classes.description}>
        {data.description}
      </Typography>
      <Button
        onClick={() => {
          history.push(`/generate/${data.name.toLowerCase()}`);
        }}
        color={'primary'}
      >
        Generate Key
      </Button>
    </Paper>
  );
};
