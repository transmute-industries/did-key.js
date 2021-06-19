import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Theme from "../../components/Theme/Theme";

import { ParticlesContainer } from "../../components/ParticlesContainer";

import "./404.css";

export class NotFound extends Component {
  render() {
    return (
      <Theme>
        <div className="notFound">
          <ParticlesContainer>
            <div className="copy" style={{ padding: "32px" }}>
              <Typography variant="h1">404</Typography>
              <Typography>
                page not found.
              </Typography>
              <br />
              <Button
                variant="contained"
                color={"secondary"}
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Go Home
              </Button>
            </div>
          </ParticlesContainer>
        </div>
      </Theme>
    );
  }
}

export default NotFound;
