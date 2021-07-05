import React from 'react';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export function RepresentationToggleButton({
  representation,
  setRepresentation,
  onChange,
}) {
  const handleChange = (event, newRepresentation) => {
    setRepresentation(newRepresentation);
    if (onChange) {
      onChange(newRepresentation);
    }
  };

  return (
    <ToggleButtonGroup
      value={representation}
      exclusive
      onChange={handleChange}
      aria-label="did representation"
    >
      <ToggleButton
        value="application/did+json"
        aria-label="json"
        style={{ textTransform: 'lowercase' }}
      >
        application/did+json
      </ToggleButton>
      <ToggleButton
        value="application/did+ld+json"
        aria-label="jsonld"
        style={{ textTransform: 'lowercase' }}
      >
        application/did+ld+json
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
