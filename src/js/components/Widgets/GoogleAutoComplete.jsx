import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { EditLocation } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import AutoComplete from 'react-google-autocomplete';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import VoterStore from '../../stores/VoterStore';
import initializejQuery from '../../utils/initializejQuery';

function GoogleAutoComplete (props) {
  renderLog('GoogleAutoComplete  functional component');
  const [textForMapSearch, setTextForMapSearch] = useState('');
  const { id, classes, updateTextForMapSearchInParentFromGoogle, updateTextForMapSearchInParent } = props;

  useEffect(() => {
    setTextForMapSearch(VoterStore.getTextForMapSearch());
  }, []);

  initializejQuery(() => {
    // If you started a session at settings/address, jQuery would not already be loaded
    const { $ } = window;
    // Put the Google guesses container higher than the pop-up, so it is visible
    $('<style> .pac-container { z-index: 10000; } </style>').appendTo('head');
  });

  return (
    <Paper classes={{ root: classes.addressBoxPaperStyles }} elevation={2}>
      <EditLocation className="ion-input-icon" />
      <AutoComplete
        apiKey={webAppConfig.GOOGLE_MAPS_API_KEY}
        onChange={(place) => updateTextForMapSearchInParent((place && place.target && place.target.value) || '')}
        onPlaceSelected={(place) => updateTextForMapSearchInParentFromGoogle((place && place.formatted_address) || '')}
        defaultValue={textForMapSearch}
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
    </Paper>
  );
}
GoogleAutoComplete.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.string,
  updateTextForMapSearchInParent: PropTypes.func,
  updateTextForMapSearchInParentFromGoogle: PropTypes.func,
};

const styles = (theme) => ({
  addressBoxPaperStyles: {
    padding: '2px .7rem',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      minWidth: '340px',
    },
  },
});

export default withStyles(styles)(GoogleAutoComplete);
