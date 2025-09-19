import { LocationOn } from '@mui/icons-material';
import { Paper } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import AutoComplete from 'react-google-autocomplete';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import initializejQuery from '../../common/utils/initializejQuery';

/*
GoogleAutoComplete does not work on the iOS simulators, but does work on a usb tethered physical phone

Google cloud console http referrers (Website)
https://console.cloud.google.com/apis/credentials/key/db...45?inv=1&invt=Ab27OA&project=wevoteapps
(If you turn them off temporarily, the list is erased, so here it is...)
*/
// app://localhost/index.html
// file_url//android_asset/www/index.html#/
// https://*.wevote.us/
// https://wevotedeveloper.com:3000

/*
August 24, 2025: Google Places/Maps disabled in Cordova by not setting a value for GOOGLE_MAPS_API_KEY in config.js
July 2025: http referrers are not going to work for Cordova anymore
   https://github.com/apache/cordova/discussions/560
   And setting
       <preference name="hostname" value="wevote.us" />
       <preference name="scheme" value="https" />
   in Cordova, had no effect. Google still replied with a console error:
       ERROR: Google Maps JavaScript API error: RefererNotAllowedMapError
       https://developers.google.com/maps/documentation/javascript/error-messages#referer-not-allowed-map-error
       Your site URL to be authorized: app://localhost/index.html
*/


function GoogleAutoComplete (props) {
  renderLog('GoogleAutoComplete  functional component');
  // const [textForMapSearch, setTextForMapSearch] = useState('');
  const { id, classes, updateTextForMapSearchInParentFromGoogle, updateTextForMapSearchInParent } = props;

  initializejQuery(() => {
    // If you started a session at settings/address, jQuery would not already be loaded
    const { $ } = window;
    // Put the Google guesses container higher than the pop-up, so it is visible
    $('<style> .pac-container { z-index: 10000; } </style>').appendTo('head');
  });

  return (
    <Paper classes={{ root: classes.addressBoxPaperStyles }} elevation={2}>
      <LocationOn className="ion-input-icon" />
      <AutoComplete
        apiKey={webAppConfig.GOOGLE_MAPS_API_KEY}
        onChange={(place) => updateTextForMapSearchInParent((place && place.target && place.target.value) || '')}
        onPlaceSelected={(place) => updateTextForMapSearchInParentFromGoogle((place && place.formatted_address) || '')}
        defaultValue="" // {textForMapSearch}
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
