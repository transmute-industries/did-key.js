import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import loading from "./transmute-loading-white.gif";

export const TransmuteLoading = ({ message }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
    >
      <Box style={{ flexDirection: "column", textAlign: "center" }}>
        <img
          src={loading}
          alt="loading"
          style={{
            filter:
              "brightness(20%) sepia(3) saturate(300%) hue-rotate(-150deg)",
          }}
        />
        <Typography style={{ marginTop: "16px" }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

TransmuteLoading.propTypes = {
  message: PropTypes.any,
};
