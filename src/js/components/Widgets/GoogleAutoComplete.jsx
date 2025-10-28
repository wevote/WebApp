import { LocationOn } from '@mui/icons-material';
import { Paper, TextField } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import AutoComplete from 'react-google-autocomplete';
import { isCordovaPhone, isIPad } from '../../common/utils/cordovaUtils';
import initializejQuery from '../../common/utils/initializejQuery';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import $ajax from '../../utils/service';
import GoogleSelectMenuReplica from './GoogleSelectMenuReplica';

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
  const { id, classes, updateTextForMapSearchInParentFromGoogle, updateTextForMapSearchInParent } = props;
  const [showCordovaSuggestions, setShowCordovaSuggestions] = useState(false);
  const [cordovaSuggestions, setCordovaSuggestions] = useState([]);
  const [cordovaMatchText, setCordovaMatchText] = useState('');

  const optionClickedCordova = (value) => {
    const txtFld = document.getElementById('cordovaTextField');
    txtFld.value = value;
    setShowCordovaSuggestions(false);
    updateTextForMapSearchInParent(value);
    updateTextForMapSearchInParentFromGoogle(value);
  };

  const handleAddressChangeCordova = (event) => {
    let lat = '';
    let lon = '';
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log('handleAddressChangeCordova', JSON.stringify(position));
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    },
    (error) => {
      console.log('ERROR handleAddressChangeCordova', JSON.stringify(error));
    },
    { timeout: 5000 });

    initializejQuery(() => {
      // console.log('handleAddressChangeCordova before ajax');
      $ajax({
        endpoint: 'webAppAutocompleteProxy',
        // for testing this api only on local server
        // baseUrl: 'https://wevotedeveloper.com:8000/apis/v1/',  // Comment out for production!
        data: {
          input: event.target.value,
          lat,
          lon,
        },
        success: (resp) => {
          // console.log('cordovaAutocomplete', resp);
          setShowCordovaSuggestions(true);
          setCordovaSuggestions(resp.matches);
          setCordovaMatchText(event.target.value);
        },
      });
    });
  };

  return (
    <Paper id="GAC-Paper" classes={{ root: classes.addressBoxPaperStyles }} elevation={2} sx={isCordovaPhone() ? { paddingLeft: '33px', boxShadow: 'none' } : {}}>
      <LocationOn className="ion-input-icon" sx={isCordova() ? { display: 'none' } : {}} />
      {isWebApp() ? (
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
      ) : (
        <div style={{ display: 'grid', width: '100%', transform: 'translateX(-33px)' }}>
          <TextField
            fullWidth
            placeholder="Street number, full address and ZIP..."
            onChange={handleAddressChangeCordova}
            variant="outlined"
            size="small"
            id="cordovaTextField"
            sx={{
              width: '100%',
              gridColumn: 1,
              gridRow: 1,
            }}
            inputProps={{
              autoComplete: 'off',
            }}
          />
          <GoogleSelectMenuReplica
            display={showCordovaSuggestions}
            suggestions={cordovaSuggestions}
            inputText={cordovaMatchText}
            clickHandler={optionClickedCordova}
          />
        </div>
      )}
    </Paper>
  );
}
GoogleAutoComplete.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.string,
  updateTextForMapSearchInParent: PropTypes.func,
  updateTextForMapSearchInParentFromGoogle: PropTypes.func,
};

function getPadLeft () {
  return isCordovaPhone() ? '33px' : '';
}

function getBoxShadow () {
  return isCordovaPhone() || isIPad() ? 'none' : '';
}

const styles = (theme) => ({
  addressBoxPaperStyles: {
    padding: '2px .7rem',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      minWidth: '340px',
    },
    paddingLeft: getPadLeft(),
    boxShadow: getBoxShadow(),
  } });

export default withStyles(styles)(GoogleAutoComplete);
