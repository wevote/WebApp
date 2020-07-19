import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DialogTitle, IconButton, DialogContent } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import PositionPublicToggle from '../PositionPublicToggle';
import Slides from './Slides';
import SettingsAccount from '../../Settings/SettingsAccount';
import VoterStore from '../../../stores/VoterStore';

class ChooseOrOppose extends Component {
  static propTypes = {
    classes: PropTypes.object,
    ballotItemType: PropTypes.string.isRequired,
    externalUniqueId: PropTypes.string,
    onClose: PropTypes.func,
    inModal: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      voterIsSignedIn,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      voterIsSignedIn,
    });
  }

  getSlides = () => {
    const { ballotItemType } = this.props;
    const { voterIsSignedIn } = this.state;
    const slides = [
      (
        <React.Fragment>
          <SubTitle>Your position is only visible to your We Vote friends.</SubTitle>
          <PlainText>You can change the privacy toggle to make your views public.</PlainText>
          <Row>
            <BoldText>Test the toggle here:</BoldText>
            <PositionPublicToggle
              inModal={this.props.inModal}
              ballotItemWeVoteId="null"
              className="null"
              externalUniqueId={`practiceToggle-${this.props.externalUniqueId}`}
              ballotItemType={ballotItemType}
              inTestMode
            />
          </Row>
        </React.Fragment>
      ),
      (
        <React.Fragment>
          <SubTitle>We Vote helps you get ready.</SubTitle>
          <BoldText>BUT, you cannot use We Vote to cast your vote.</BoldText>
          <PlainText>Make sure to return your official ballot to your polling location!</PlainText>
        </React.Fragment>
      ),
      (
        <>
          {voterIsSignedIn ? (
            <div>
              Thank you for signing in!
            </div>
          ) : (
            <SettingsAccount
              pleaseSignInTitle="Sign in to save your choices!"
              pleaseSignInSubTitle=""
              toggleSignInModal={this.props.onClose}
              inModal
            />
          )}
        </>
      ),
    ];
    return slides;
  }

  render () {
    const { classes } = this.props;
    const { voterIsSignedIn } = this.state;
    return (
      <React.Fragment>
        <DialogTitle classes={{ root: classes.dialogTitle }}>
          <TitleText>Choose or Oppose</TitleText>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={this.props.onClose}
            id="profileCloseItemActionBar"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <HorizontalLine />
        <DialogContent classes={{ root: classes.dialogContent }}>
          <Slides
            onClose={this.props.onClose}
            slides={this.getSlides()}
            voterIsSignedIn={voterIsSignedIn}
          />
        </DialogContent>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  button: {
    width: '100%',
  },
  dialogTitle: {
    paddingTop: 22,
    paddingBottom: 5,
    display: 'flex',
  },
  closeButton: {
    position: 'absolute',
    right: `${theme.spacing(1)}px`,
    top: `${theme.spacing(1)}px`,
  },
});

const HorizontalLine = styled.div`
  background-color: #eee;
  height: 2px;
  margin: 0 24px;
  margin-bottom: 8px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin 0;
    margin-bottom: 8px;
  }
`;

const TitleText = styled.div`
  font-weight: bold;
  font-size: 20px;
  color: #333;
  margin-bottom: 4px;
`;

const SubTitle = styled.div`
  font-size: 18px;
  color: #333;
  text-align: left;
  margin-bottom: 4px;
`;

const PlainText = styled.div`
  font-size: 14px;
  color: #666;
  text-align: left;
`;

const BoldText = styled.span`
  font-weight: bold;
`;

const Row = styled.div`
  display: flex;
  margin: 16px 0;
  margin-top: 20px;
`;

export default withStyles(styles)(ChooseOrOppose);
