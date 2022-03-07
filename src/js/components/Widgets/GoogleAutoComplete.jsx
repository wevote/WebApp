import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { EditLocation } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import AutoComplete from 'react-google-autocomplete';
// import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import VoterStore from '../../stores/VoterStore';
import initializejQuery from '../../utils/initializejQuery';

class GoogleAutoComplete extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      textForMapSearch: '',
    };
  }

  componentDidMount () {
    // console.log('In EditAddressOneHorizontalRow componentDidMount');
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
  }

  parsePlaceForTargetValue (placeResult) {
    if (placeResult && placeResult.target && placeResult.target.value) {
      return placeResult.target.value;
    }
    return '';
  }

  parsePlaceForFormattedAddress (placeResult) {
    if (placeResult && placeResult.formatted_address) {
      return placeResult.formatted_address;
    }
    return '';
  }

  render () {
    renderLog('GoogleAutoComplete  functional component');
    const {
      classes,
      id,
      updateTextForMapSearchInParent,
      updateTextForMapSearchInParentFromGoogle,
    } = this.props;
    const { textForMapSearch } = this.state;

    initializejQuery(() => {
      const { $ } = window;
      // Put the Google guesses container higher than the pop-up, so it is visible
      $('<style> .pac-container { z-index: 10000; } </style>').appendTo('head');
    });

    // paperstyles={paperstyles}
    return (
      <Paper
        classes={{ root: classes.addressBoxPaperStyles }}
        elevation={2}
      >
        <EditLocation className="ion-input-icon" />
        <AutoComplete
          apiKey={webAppConfig.GOOGLE_MAPS_API_KEY}
          defaultValue={textForMapSearch}
          onChange={(placeResult) => updateTextForMapSearchInParent(this.parsePlaceForTargetValue(placeResult))}
          onPlaceSelected={(placeResult) => updateTextForMapSearchInParentFromGoogle(this.parsePlaceForFormattedAddress(placeResult))}
          style={{
            width: '100%',
            border: 'unset',
            height: '2em',
          }}
          placeholder="Street number, full address & ZIP..."
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
}
GoogleAutoComplete.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.string,
  // paperstyles: PropTypes.object,
  updateTextForMapSearchInParent: PropTypes.func,
  updateTextForMapSearchInParentFromGoogle: PropTypes.func,
};

// const StyledPaper = styled(Paper)`${(props) => props.paperstyles}`;

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
