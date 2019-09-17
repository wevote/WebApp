import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import PositionPublicToggle from '../PositionPublicToggle';
import Slides from './Slides';
import TwitterSignIn from '../../Twitter/TwitterSignIn';
import FacebookSignIn from '../../Facebook/FacebookSignIn';
import VoterEmailAddressEntry from '../../VoterEmailAddressEntry';

class ChooseOrOppose extends Component {
  static propTypes = {
    classes: PropTypes.object,
    type: PropTypes.string.isRequired,
    modalSupportProps: PropTypes.object,
    externalUniqueId: PropTypes.string,
    onClose: PropTypes.func,
  }

  getSlides = () => {
    const { type, modalSupportProps } = this.props;
    const slides = [
      (
        <React.Fragment>
          <SubTitle>Your position is only visible to your We Vote friends.</SubTitle>
          <P>You can change the privacy toggle to make your views public.</P>
          <Row>
            <B>Test the toggle here:</B>
            <PositionPublicToggle
                ballotItemWeVoteId="null"
                className="null"
                externalUniqueId={`practiceToggle-${this.props.externalUniqueId}`}
                type={type}
                supportProps={modalSupportProps}
                inTestMode
            />
          </Row>
        </React.Fragment>
      ),
      (
        <React.Fragment>
          <SubTitle>We Vote helps you get ready,</SubTitle>
          <B>but you cannot use We Vote to cast your vote.</B>
          <P>Make sure to return your official ballot to your polling location!</P>
        </React.Fragment>
      ),
      (
        <React.Fragment>
          <SubTitle>Sign in to save your choices!</SubTitle>
          <P>Your choices are archived on the same browser if you don&apos;t sign in.</P>
          <B>Recommended</B>
          <SignInButtonContainer>
            <FacebookSignIn buttonText="Sign in with Facebook" />
          </SignInButtonContainer>
          <SignInButtonContainer>
            <TwitterSignIn buttonText="Sign in with Twitter" />
          </SignInButtonContainer>
          <HR />
          <VoterEmailAddressEntry />
        </React.Fragment>
      ),
    ];
    return slides;
  }

  render () {
    const { classes } = this.props;
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
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <HR />
        <DialogContent classes={{ root: classes.dialogContent }}>
          <Slides slides={this.getSlides()} onClose={this.props.onClose} />
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

const HR = styled.div`
  background-color: #eee;
  height: 2px;
  margin: 0 24px;
  margin-bottom: 8px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin 0;
    margin-bottom: 8px;
  }
`;

const TitleText = styled.p`
  font-weight: bold;
  font-size: 20px;
  color: #333;
  margin-bottom: 4px;
`;

const SubTitle = styled.p`
  font-size: 20px;
  color: #333;
  text-align: left;
  margin-bottom: 4px;
`;

const P = styled.p`
  font-size: 14px;
  color: #666;
  text-align: left;
`;

const B = styled.p`
  font-weight: bold;
`;

const Row = styled.div`
  display: flex;
  margin: 16px 0;
  margin-top: 20px;
`;

const SignInButtonContainer = styled.div`
  margin-bottom: 1em;
`;

export default withStyles(styles)(ChooseOrOppose);
