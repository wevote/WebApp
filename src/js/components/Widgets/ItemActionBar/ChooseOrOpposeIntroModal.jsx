import { Close } from '@mui/icons-material';
import { Button, DialogContent, DialogTitle, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import VoterStore from '../../../stores/VoterStore';
import PositionPublicToggle from '../../PositionItem/PositionPublicToggle';

const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../../../common/components/SignIn/SignInOptionsPanel'));


class ChooseOrOpposeIntroModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentSlideKey: 'signIn',
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      currentSlideKey: voterIsSignedIn ? 'getReady' : 'signIn',
      voterIsSignedIn,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    const { currentSlideKey } = this.state;
    if (voterIsSignedIn && (currentSlideKey === 'signIn')) {
      this.setState({
        currentSlideKey: 'getReady',
      });
    }
    this.setState({
      voterIsSignedIn,
    });
  }

  getSlides = () => {
    const { ballotItemType, classes } = this.props;
    const { voterIsSignedIn } = this.state;
    const slides = {
      getReady:
        (
          <>
            <SubTitle>WeVote helps you get ready to vote, BUT does not officially cast your vote.</SubTitle>
            <PlainText>Make sure to return your official ballot to your local election registrar.</PlainText>
            <Options buttons="2">
              {!voterIsSignedIn && (
                <Button
                  classes={{ root: classes.optionsButton }}
                  variant="outlined"
                  color="primary"
                  onClick={() => this.changeCurrentSlideIndex('signIn')}
                >
                  Previous
                </Button>
              )}
              <Button
                classes={voterIsSignedIn ? { root: classes.button } : { root: classes.optionsButton }}
                variant="contained"
                color="primary"
                onClick={this.props.onClose}
              >
                Close
              </Button>
            </Options>
          </>
        ),
      toggle:
        (
          <>
            <SubTitle>Your position is only visible to your WeVote friends.</SubTitle>
            <PlainText>You can make your views public with the privacy toggle.</PlainText>
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
            <Options buttons="2">
              <Button
                classes={{ root: classes.optionsButton }}
                variant="outlined"
                color="primary"
                onClick={() => this.changeCurrentSlideIndex('getReady')}
              >
                Previous
              </Button>
              <Button
                classes={{ root: classes.optionsButton }}
                variant="contained"
                color="primary"
                onClick={this.props.onClose}
              >
                Close
              </Button>
            </Options>
          </>
        ),
    };
    if (!voterIsSignedIn) {
      slides.signIn = (
        <Suspense fallback={<></>}>
          <>
            <SignInOptionsPanel
              pleaseSignInTitle="Sign in to save your choices!"
              pleaseSignInSubTitle=""
              toggleSignInModal={this.props.onClose}
              inModal
            />
            <Options buttons="1">
              <Button
                classes={{ root: classes.button }}
                variant="outlined"
                color="primary"
                onClick={() => this.changeCurrentSlideIndex('getReady')}
              >
                Sign In Later
              </Button>
            </Options>
          </>
        </Suspense>
      );
    }
    return slides;
  }

  changeCurrentSlideIndex = (newSlideIndex) => {
    this.setState({
      currentSlideKey: newSlideIndex,
    });
    return null;
  }

  render () {
    const { classes } = this.props;
    const { currentSlideKey } = this.state;
    // console.log('currentSlideKey:', currentSlideKey);
    const slides = this.getSlides();
    return (
      <>
        <DialogTitle classes={{ root: classes.dialogTitle }}>
          <TitleText>Choose or Oppose</TitleText>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={this.props.onClose}
            id="profileCloseItemActionBar"
            size="large"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <HorizontalLine />
        <DialogContent classes={{ root: classes.dialogContent }}>
          <SlidesWrapper>
            <SlidesContainer>
              {slides[currentSlideKey]}
            </SlidesContainer>
          </SlidesWrapper>
        </DialogContent>
      </>
    );
  }
}
ChooseOrOpposeIntroModal.propTypes = {
  classes: PropTypes.object,
  ballotItemType: PropTypes.string.isRequired,
  externalUniqueId: PropTypes.string,
  onClose: PropTypes.func,
  inModal: PropTypes.bool,
};

const styles = (theme) => ({
  button: {
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  dialogTitle: {
    paddingTop: 22,
    paddingBottom: 5,
    display: 'flex',
  },
  nextButton: {
    width: '50%',
    margin: 8,
  },
  optionsButton: {
    minWidth: '40%',
    width: '50%',
    margin: 8,
    [theme.breakpoints.down('md')]: {
      width: '40%',
    },
  },
});

const HorizontalLine = styled('div')(({ theme }) => (`
  background-color: #eee;
  height: 2px;
  margin: 0 24px;
  margin-bottom: 8px;
  ${theme.breakpoints.down('md')} {
    margin: 0 0 8px 0;
  }
`));

const Options = styled('div')(({ buttons }) => (`
  display: flex;
  flex-flow: ${buttons > 1 ? 'row' : 'column'};
  ${buttons > 1 ? 'justify-content: space-between;' : ''};
  margin-top: 1em;
`));

const TitleText = styled('div')`
  font-weight: bold;
  font-size: 20px;
  color: #333;
  margin-bottom: 4px;
`;

const SubTitle = styled('div')`
  font-size: 18px;
  color: #333;
  text-align: left;
  margin-bottom: 4px;
`;

const PlainText = styled('div')`
  color: #666;
  text-align: left;
`;

const BoldText = styled('div')`
  font-weight: bold;
`;

const Row = styled('div')`
  // display: flex;
  margin: 16px 0;
  margin-top: 20px;
`;

const SlidesContainer = styled('div')`
  display: block;
`;

const SlidesWrapper = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: column;
  min-width: 508px;
  min-height: 205px;
  justify-content: space-between;
  ${theme.breakpoints.down('md')} {
    width: 100%;
    min-width: 260px;
  }
`));

export default withStyles(styles)(ChooseOrOpposeIntroModal);
