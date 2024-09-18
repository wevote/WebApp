import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import historyPush from '../../common/utils/historyPush';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import webAppConfig from '../../config';
import {
  Dot,
  InnerWrapper,
  IntroHeader,
  ListMaxWidth,
  ListRow,
  ListTitleRow,
  ListWrapper,
  OuterWrapper,
  ShowMoreWrapper,
  StepNumber,
  StepNumberPlaceholder,
  StepText,
  StepTitle,
} from '../Style/ReadyIntroductionStyles';
import ShowMoreButtons from '../Widgets/ShowMoreButtons';

const twitterEnabled = webAppConfig.ENABLE_TWITTER === undefined ? false : webAppConfig.ENABLE_TWITTER;
const facebookEnabled =  webAppConfig.ENABLE_FACEBOOK === undefined ? false : webAppConfig.ENABLE_FACEBOOK;

class ReadyIntroduction extends Component {
  constructor (props) {
    super(props);
    this.state = {
      contentUnfurled: false,
    };
    this.firstListItemRef = React.createRef();
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { contentUnfurledOnLoad } = this.props;
    this.setState({
      contentUnfurled: contentUnfurledOnLoad,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    const voterIsSignedInWithFacebook = VoterStore.getVoterIsSignedInWithFacebook();
    const voterIsSignedInWithTwitter = VoterStore.getVoterIsSignedInWithTwitter();
    this.setState({
      voterIsSignedIn,
      voterIsSignedInWithFacebook,
      voterIsSignedInWithTwitter,
    });
  }

  contentUnfurledLink = () => {
    const { contentUnfurled } = this.state;
    this.setState({
      contentUnfurled: !contentUnfurled,
    });
    if (!contentUnfurled) {
      this.firstListItemRef.current.focus();
    }
  }

  showSelectBallotModalEditAddress = () => {
    const showEditAddress = true;
    const showSelectBallotModal = true;
    AppObservableStore.setShowSelectBallotModal(showSelectBallotModal, showEditAddress);
  }

  onSignInClick = () => {
    const { voterIsSignedIn } = this.state;
    if (voterIsSignedIn) {
      historyPush('/settings/account');
      return true;
    } else {
      AppObservableStore.setShowSignInModal(true);
      return true;
    }
  }

  render () {
    renderLog('ReadyIntroduction');  // Set LOG_RENDER_EVENTS to log all renders
    const { contentUnfurled, voterIsSignedInWithFacebook, voterIsSignedInWithTwitter } = this.state;
    const { contentUnfurledOnLoad, showStep3WhenCompressed, titleCentered, titleLarge } = this.props;
    return (
      <OuterWrapper>
        <InnerWrapper>
          <IntroHeader titleCentered={titleCentered} titleLarge={titleLarge} tabIndex={0} ref={this.firstListItemRef}>
            WeVote helps you:
          </IntroHeader>
          <ListWrapper>
            <ListMaxWidth>
              <ListTitleRow onClick={this.contentUnfurledLink}>
                <Dot><StepNumber>1</StepNumber></Dot>
                <StepTitle>Be ready to vote</StepTitle>
              </ListTitleRow>
              {contentUnfurled && (
                <ListRow>
                  <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                  <StepText id="readyIntroductionStepText1">
                    <button style={{ backgroundColor: 'transparent', border: 'none', padding: '0' }} onClick={this.showSelectBallotModalEditAddress} type="button">
                      <span className="u-link-color u-link-color-on-hover u-link-underline-on-hover">Enter your address</span>
                    </button>
                    {' '}
                    to find out when your next election is, and
                    {' '}
                    <Link to="/ballot" className="u-link-color">preview your ballot</Link>
                    .
                    {' '}
                    How are
                    {' '}
                    <Link to="/findfriends/importcontacts" className="u-link-color">your friends</Link>
                    {' '}
                    planning to vote?
                  </StepText>
                </ListRow>
              )}

              <ListTitleRow onClick={this.contentUnfurledLink}>
                <Dot><StepNumber>2</StepNumber></Dot>
                <StepTitle>Be confident in your choices</StepTitle>
              </ListTitleRow>
              {contentUnfurled && (
                <ListRow>
                  <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                  <StepText id="readyIntroductionStepText2">
                    Tell us what topics are important to you and we&apos;ll recommend people and organizations to follow as well as make ballot recommendations.
                    {' '}
                    { twitterEnabled && (
                      voterIsSignedInWithTwitter ? (
                        <>Since you are signed in with Twitter, you will see endorsements of everyone you follow on Twitter. </>
                      ) : (
                        <>
                          <span className="u-link-color u-link-color-on-hover u-cursor--pointer" onClick={this.onSignInClick}>
                            Link to your Twitter account
                          </span>
                          {' '}
                          and see endorsements of everyone you follow on Twitter.
                        </>
                      )
                    )}
                  </StepText>
                </ListRow>
              )}
              {(contentUnfurled || showStep3WhenCompressed) && (
                <ListTitleRow onClick={this.contentUnfurledLink}>
                  <Dot><StepNumber>3</StepNumber></Dot>
                  <StepTitle>Help friends &amp; amplify your impact</StepTitle>
                </ListTitleRow>
              )}
              {contentUnfurled && (
                <ListRow>
                  <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                  <StepText id="readyIntroductionStepText3">
                    {isWebApp() || isCordova() ? (
                      <Link to="/findfriends/importcontacts" className="u-link-color">Invite your friends</Link>
                    ) : (
                      <>Invite your friends</>
                    )}
                    {' '}
                    to join WeVote to encourage them to vote, share your ballot and endorsements, engage in discussions and more!
                    {' '}
                    { facebookEnabled && (
                      voterIsSignedInWithFacebook ? (
                        <></>
                      ) : (
                        <>
                          <span className="u-link-color u-link-color-on-hover u-cursor--pointer" onClick={this.onSignInClick}>
                            Link to your Facebook account
                          </span>
                          {' '}
                          so your friends can find you.
                          {' '}
                        </>
                      )
                    )}
                    Studies show people are more likely to vote if they see their friends voting.
                  </StepText>
                </ListRow>
              )}
              {!contentUnfurledOnLoad && (
                <ShowMoreWrapper>
                  <ShowMoreButtons
                    showMoreId="showMoreReadyIntroductionCompressed"
                    showMoreButtonWasClicked={contentUnfurled}
                    showMoreButtonsLink={this.contentUnfurledLink}
                  />
                </ShowMoreWrapper>
              )}
            </ListMaxWidth>
          </ListWrapper>
        </InnerWrapper>
      </OuterWrapper>
    );
  }
}
ReadyIntroduction.propTypes = {
  contentUnfurledOnLoad: PropTypes.bool,
  showStep3WhenCompressed: PropTypes.bool,
  titleCentered: PropTypes.bool,
  titleLarge: PropTypes.bool,
};

export default withTheme(ReadyIntroduction);
