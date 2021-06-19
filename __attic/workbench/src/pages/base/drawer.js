import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import CodeIcon from '@material-ui/icons/Code';
import GavelIcon from '@material-ui/icons/Gavel';
import history from '../../store/history';

export default function DrawerContent() {
  return (
    <List>
      <ListItem
        button
        onClick={() => {
          history.push('/');
        }}
      >
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary={'Home'} />
      </ListItem>

      <ListItem
        button
        onClick={() => {
          window.open('https://w3c-ccg.github.io/did-method-key/');
        }}
      >
        <ListItemIcon>
          <GavelIcon />
        </ListItemIcon>
        <ListItemText primary={'Spec'} />
      </ListItem>

      <ListItem
        button
        onClick={() => {
          window.open('https://github.com/transmute-industries/did-key.js');
        }}
      >
        <ListItemIcon>
          <CodeIcon />
        </ListItemIcon>
        <ListItemText primary={'Code'} />
      </ListItem>
    </List>
  );
}
