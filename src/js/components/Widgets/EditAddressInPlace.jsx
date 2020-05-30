import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SettingsIcon from '@material-ui/icons/Settings';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import AddressBox from '../AddressBox';
import { historyPush, isWebApp } from '../../utils/cordovaUtils';
import { calculateBallotBaseUrl, shortenText } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';

class EditAddressInPlace extends Component {
  static propTypes = {
    address: PropTypes.object.isRequired,
    ballotBaseUrl: PropTypes.string,
    classes: PropTypes.object,
    defaultIsEditingAddress: PropTypes.bool,
    noAddressMessage: PropTypes.string,
    pathname: PropTypes.string,
    toggleEditingAddress: PropTypes.func,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      editingAddress: false,
      textForMapSearch: '',
    };
    this.toggleEditingAddress = this.toggleEditingAddress.bind(this);
  }

  componentDidMount () {
    // console.log('In EditAddressInPlace componentDidMount');
    this.setState({
      editingAddress: this.props.defaultIsEditingAddress,
      textForMapSearch: this.props.address.text_for_map_search || '',
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('EditAddressInPlace componentWillReceiveProps');
    this.setState({
      textForMapSearch: nextProps.address.text_for_map_search || '',
    });
  }

  incomingToggleFunction = () => {
    if (this.props.toggleFunction) {
      this.props.toggleFunction();
    }
  }

  toggleEditingAddress () {
    const { editingAddress } = this.state;
    if (this.props.toggleEditingAddress) {
      this.props.toggleEditingAddress();
    }
    if (isWebApp()) {
      this.setState({
        editingAddress: !editingAddress,
      });
    } else {
      // The scrolling pane within the Modal causes an '[LayoutConstraints] Unable to simultaneously satisfy constraints.'
      // error in Cordova, when you try to expand it to fit for entering text in the address box, and Cordova messes up
      // the display as in https://github.com/wevote/WeVoteCordova/issues/52  So instead use the non modal version in
      // the settings/location route.
      this.incomingToggleFunction();
      historyPush('/settings/address');
    }
  }

  render () {
    renderLog('EditAddressInPlace');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { editingAddress, textForMapSearch } = this.state;
    const noAddressMessage = this.props.noAddressMessage ? this.props.noAddressMessage : '- no address entered -';
    const maximumAddressDisplayLength = 60;
    const ballotBaseUrl = calculateBallotBaseUrl(this.props.ballotBaseUrl, this.props.pathname);

    if (editingAddress) {
      return (
        <span>
          <h4 className="h4">Your Address</h4>
          <AddressBox
            showCancelEditAddressButton
            toggleEditingAddress={this.toggleEditingAddress}
            saveUrl={ballotBaseUrl}
            toggleSelectAddressModal={this.props.toggleFunction}
            editingAddress={editingAddress}
          />
        </span>
      );
    } else {
      return (
        <SettingsIconWrapper
          id="editAddressInPlaceModalEditButton"
          onClick={this.toggleEditingAddress}
        >
          <EditAddressPreview>
            { textForMapSearch.length ? shortenText(textForMapSearch, maximumAddressDisplayLength) : noAddressMessage }
            {' '}
          </EditAddressPreview>
          <SettingsIcon classes={{ root: classes.settingsIcon }} />
        </SettingsIconWrapper>
      );
    }
  }
}

const styles = {
  settingsIcon: {
    color: '#999',
    marginTop: '-5px',
    marginLeft: '3px',
    width: 16,
    height: 16,
  },
  tooltipPlacementBottom: {
    marginTop: 0,
  },
};

const EditAddressPreview = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
`;

const SettingsIconWrapper = styled.div`
  margin-left: 15px;
  margin-right: 15px;
`;

export default withStyles(styles)(EditAddressInPlace);
