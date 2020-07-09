import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";

import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";
// import Typography from '@material-ui/core/Typography';

import QrReader from "react-qr-reader";
import { JSONEditor } from "@transmute/material-did-core";
export class ScanQRCodeDialog extends React.Component {
  state = {
    data: "",
  };

  handleClose = () => {
    this.props.onClose();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state.data);
  };

  render() {
    return (
      <div>
        <Dialog
          fullScreen
          open={this.props.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Scan QR Code</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={12} sm={4}>
                <QrReader
                  delay={100}
                  resolution={800}
                  onError={() => {
                    // do nothing
                  }}
                  onScan={(data) => {
                    if (data) {
                      let context = null;
                      const beep = (freq = 520, duration = 200, vol = 100) => {
                        const oscillator = context.createOscillator();
                        const gain = context.createGain();
                        oscillator.connect(gain);
                        oscillator.frequency.value = freq;
                        oscillator.type = "square";
                        gain.connect(context.destination);
                        gain.gain.value = vol * 0.01;
                        oscillator.start(context.currentTime);
                        oscillator.stop(context.currentTime + duration * 0.001);
                      };
                      context = new AudioContext();
                      beep(300, 300, 25);
                      try {
                        this.setState({
                          data: data,
                        });
                      } catch (e) {
                        console.error(e);
                      }
                    }
                  }}
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <JSONEditor
                  value={this.state.data}
                  // style={{ height: "128px" }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Cancel</Button>
            <Button
              onClick={this.handleSubmit}
              color="primary"
              variant="contained"
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ScanQRCodeDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
