import { LocationOn } from '@mui/icons-material';
import { Paper, styled, TextField } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import AutoComplete from 'react-google-autocomplete';
import { isCordovaPhone, isIPad } from '../../common/utils/cordovaUtils';
import initializejQuery from '../../common/utils/initializejQuery';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import $ajax from '../../utils/service';
import GoogleSelectMenuReplica from './GoogleSelectMenuReplica';

/* global $ */

/*
Google cloud console http referrers (Website)
https://console.cloud.google.com/apis/credentials/key/db...45?inv=1&invt=Ab27OA&project=wevoteapps
(If you turn them off temporarily, the list is erased, so here it is...)
  http://localhost:3000/
  https://wevotedeveloper.com:3000
  https://*.wevote.us/
  https://api.wevoteusa.org
  app://localhost/index.html                (Might not work anymore November 2025)
  file_url//android_asset/www/index.html#/  (Might not work anymore November 2025)
*/


// November 2025:  WebApp uses AutoComplete (react-google-autocomplete) which in turn uses the deprecated
// "google.maps.places.AutocompleteService" -- Google says "As of March 1st, 2025, google.maps.places.AutocompleteService is not available to new customers."
// See  https://github.com/ErrorPro/react-google-autocomplete/issues/246
// Our Cordova uses <GoogleSelectMenuReplica>, a "roll your own" implementation that does the search from the Python server, this
// allows us to use and API key that is hidden from the world which was not possible in a WebView within Cordova.
function GoogleAutoComplete (props) {
  renderLog('GoogleAutoComplete  functional component');
  const { id, classes, updateTextForMapSearchInParentFromGoogle, updateTextForMapSearchInParent } = props;
  const [showCordovaSuggestions, setShowCordovaSuggestions] = useState(false);
  const [cordovaSuggestions, setCordovaSuggestions] = useState([]);
  const [cordovaMatchText, setCordovaMatchText] = useState('');

  useEffect(() => () => {
    // console.log('Component unmounted! Hiding google address choices');
    $('.pac-container').css({
      display: 'none',
    });
  }, []);

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
          $('.ion-input-icon').css('display', 'none');
        },
      });
    });
  };

  const paperSx = { boxShadow: 'none'};
  if (isCordovaPhone) {
    paperSx.paddingLeft = '33px';
  }

  const handleAddressChangeWebApp = (place) => {
    $('.pac-container').css({
      display: 'block',
      zIndex: 1400,
    });
    updateTextForMapSearchInParent((place && place.target && place.target.value) || '');
  };

  const handleAddressSelectionWebApp = (place) => {
    $('.pac-container').css({
      display: 'none',
    });
    updateTextForMapSearchInParentFromGoogle((place && place.formatted_address) || '');
  };


  return (
    <Paper id="GAC-Paper" classes={{ root: classes.addressBoxPaperStyles }} elevation={2} sx={paperSx}>
      <LocationOn className="ion-input-icon" sx={isCordova() ? { display: 'none' } : {}} />
      {isWebApp() ? (
        <AutoComplete
          apiKey={webAppConfig.GOOGLE_MAPS_API_KEY}
          onChange={(place) => handleAddressChangeWebApp(place)}
          onPlaceSelected={(place) => handleAddressSelectionWebApp(place)}
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
        <AddressEntryBox>
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
        </AddressEntryBox>
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

const AddressEntryBox = styled('div')`
  display: grid;
  width: 100%;
  ${isCordova() ? 'transform: translateX(-33px)' : ''};
`;

export default withStyles(styles)(GoogleAutoComplete);
