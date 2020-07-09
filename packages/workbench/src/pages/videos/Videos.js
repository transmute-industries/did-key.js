import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Base from "../base/base";

export const Videos = (props) => {
  return (
    <Base>
      <Typography variant={"h5"} gutterBottom>
        Videos
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Typography style={{ marginTop: "32px" }} variant={"h6"} gutterBottom>
            Offline Demo
          </Typography>
          <iframe
            title="intro video"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/-i4am8LoV7s"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>

          <Typography style={{ marginTop: "32px" }}>
            DID Resolution, Credential Issuance and Verification, powered by
            Progressive Web Applications, PDFs, QR Codes and printed paper.
          </Typography>
        </Grid>
      </Grid>
    </Base>
  );
};

Videos.propTypes = {
  wallet: PropTypes.any,
};
