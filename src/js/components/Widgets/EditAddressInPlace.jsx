import { withStyles } from '@material-ui/core/styles';
import { Settings } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import { calculateBallotBaseUrl, shortenText } from '../../utils/textFormat';

const AddressBox = React.lazy(() => import('../AddressBox'));
const ReadMore = React.lazy(() => import('./ReadMore'));

class EditAddressInPlace extends Component {
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

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
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
    this.setState({
      editingAddress: !editingAddress,
    });
  }

  render () {
    renderLog('EditAddressInPlace');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { location: { pathname } } = window;
    const { editingAddress, textForMapSearch } = this.state;
    const noAddressMessage = this.props.noAddressMessage ? this.props.noAddressMessage : '- no address entered -';
    const maximumAddressDisplayLength = 60;
    const ballotBaseUrl = calculateBallotBaseUrl(this.props.ballotBaseUrl, pathname);
    const addressIntroduction = "To find your correct ballot, we need your full address, including house number. We are a nonprofit, and will never reveal your address. Note: our partner who provides what's-on-the-ballot data works incredibly hard to cover the entire United States, but we cannot guarantee 100% of the items on your official ballot will be shown on We Vote. Please contact us if you have questions.";
    if (editingAddress) {
      return (
        <span>
          <div>
            Please enter your full street address with house number for your correct ballot.
          </div>
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
        <>
          <EditBlockWrapper
            className="u-cursor--pointer"
            id="editAddressInPlaceModalEditButton"
            onClick={this.toggleEditingAddress}
          >
            <EditAddressPreview>
              { textForMapSearch.length ? shortenText(textForMapSearch, maximumAddressDisplayLength) : noAddressMessage }
              {' '}
              <ChangeAddressWrapper className="u-no-break">
                <SettingsIconWrapper>
                  <Settings classes={{ root: classes.settingsIcon }} />
                </SettingsIconWrapper>
                <ChangeAddressText>
                  change address
                </ChangeAddressText>
              </ChangeAddressWrapper>
            </EditAddressPreview>
          </EditBlockWrapper>
          <AddressIntroductionWrapper>
            <ReadMore
              textToDisplay={addressIntroduction}
              numberOfLines={4}
            />
          </AddressIntroductionWrapper>
        </>
      );
    }
  }
}
EditAddressInPlace.propTypes = {
  address: PropTypes.object.isRequired,
  ballotBaseUrl: PropTypes.string,
  classes: PropTypes.object,
  defaultIsEditingAddress: PropTypes.bool,
  noAddressMessage: PropTypes.string,
  toggleEditingAddress: PropTypes.func,
  toggleFunction: PropTypes.func.isRequired,
};

const styles = {
  settingsIcon: {
    color: '#999',
    marginLeft: '3px',
    width: 16,
    height: 16,
  },
  tooltipPlacementBottom: {
    marginTop: 0,
  },
};

const ChangeAddressText = styled.div`
  color: #999;
`;

const ChangeAddressWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const EditAddressPreview = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
`;

const AddressIntroductionWrapper = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 8px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 15px;
    margin-right: 15px;
  }
`;

const EditBlockWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 15px;
    margin-right: 15px;
  }
`;

const SettingsIconWrapper = styled.div`
`;

export default withStyles(styles)(EditAddressInPlace);
