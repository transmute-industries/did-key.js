import React from "react";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

export default function ToggleButtons({ onClick }) {
  const [alignment, setAlignment] = React.useState("left");

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="did document representation"
    >
      <ToggleButton
        value="left"
        aria-label="json"
        onClick={() => {
          onClick("did+json");
        }}
      >
        did+json
      </ToggleButton>
      <ToggleButton
        value="right"
        aria-label="jsonld"
        onClick={() => {
          onClick("did+ld+json");
        }}
      >
        did+ld+json
      </ToggleButton>
      <ToggleButton value="justify" aria-label="cbor" disabled>
        did+cbor
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
