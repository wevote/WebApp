import { Paper } from '@material-ui/core';
import { EditLocation } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';
import AutoComplete from 'react-google-autocomplete';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import initializejQuery from '../../utils/initializejQuery';

export default function GoogleAutoComplete (props) {
  renderLog('GoogleAutoComplete  functional component');
  const { paperstyles, id, updateVoterAddress } = props;
  initializejQuery(() => {
    const { $ } = window;
    // Put the Google guesses container higher than the pop-up, so it is visible
    $('<style> .pac-container { z-index: 10000; } </style>').appendTo('head');
  });

  return (
    <StyledPaper paperstyles={paperstyles} elevation={2}>
      <EditLocation className="ion-input-icon" />
      <AutoComplete
        apiKey={webAppConfig.GOOGLE_MAPS_API_KEY}
        onPlaceSelected={(place) => updateVoterAddress(place)}
        style={{
          width: '100%',
          border: 'unset',
          height: '2em',
        }}
        placeholder="Street number, full address and ZIP..."
        aria-label="Address"
        options={{
          componentRestrictions: { country: 'us' },
          types: ['geocode'],
        }}
        id={id || ''}
        inputAutocompleteValue="off"
      />
    </StyledPaper>
  );
}
GoogleAutoComplete.propTypes = {
  id: PropTypes.string,
  paperstyles: PropTypes.object,
  updateVoterAddress: PropTypes.func,
};

const StyledPaper = styled(Paper)`${(props) => props.paperstyles}`;
