import React from 'react';
import {
  Link,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

// import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';

import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';

import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '32px',
  },
  title: {
    color: theme.palette.text.primary,
  },
  card: {
    background: theme.palette.background.dark,
    padding: '16px',
    paddingTop: '32px',
  },
}));

export const MethodSummaryPanel = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <Typography className={classes.title} variant={'h3'} gutterBottom>
          About the Method
        </Typography>

        <div style={{ marginBottom: '48px' }}>
          <Link
            href="https://github.com/w3c-ccg/did-method-key"
            color={'secondary'}
          >
            Read the spec
          </Link>
        </div>

        <Grid container spacing={10}>
          <Grid item xs={12} sm={12} md={6}>
            <Paper className={classes.card}>
              <Typography variant={'h4'} gutterBottom>
                Risks
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ErrorOutlineOutlinedIcon style={{ color: yellow[800] }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Immutable"
                    secondary={
                      'No support for rotation, updates or deactivation'
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ErrorOutlineOutlinedIcon style={{ color: yellow[800] }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ephemeral"
                    secondary={'Long term use discouraged'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ErrorOutlineOutlinedIcon style={{ color: yellow[800] }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="None standard"
                    secondary={'W3C CCG draft, subject to change'}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Paper className={classes.card}>
              <Typography variant={'h4'} gutterBottom>
                Benefits
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineOutlinedIcon
                      style={{ color: green[400] }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Offline Friendly"
                    secondary={'No network access required for resolution'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineOutlinedIcon
                      style={{ color: green[400] }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cryptographic Agility"
                    secondary={'Support for standard and emerging cryptography'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineOutlinedIcon
                      style={{ color: green[400] }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Modular"
                    secondary={'Useful for building other DID methods'}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
