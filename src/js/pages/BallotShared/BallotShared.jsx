import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import apiCalming from '../../common/utils/apiCalming';
import getBooleanValue from '../../common/utils/getBooleanValue';
import historyPush from '../../common/utils/historyPush';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import BrowserPushMessage from '../../components/Widgets/BrowserPushMessage';
import SnackNotifier, { openSnackbar } from '../../components/Widgets/SnackNotifier';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
// import ShareActions from '../../common/actions/ShareActions';
import ShareStore from '../../common/stores/ShareStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaSimplePageContainerTopOffset } from '../../utils/cordovaCalculatedOffsets';
// Lint is not smart enough to know that lazyPreloadPages will not attempt to preload/reload this page
// eslint-disable-next-line import/no-cycle
import lazyPreloadPages from '../../utils/lazyPreloadPages';

const BallotTitleHeader = React.lazy(() => import(/* webpackChunkName: 'BallotTitleHeader' */ '../../components/Ballot/BallotTitleHeader'));

class BallotShared extends Component {
  constructor (props) {
    super(props);
    this.state = {
      sharedByDisplayName: '',
    };
  }

  componentDidMount () {
    // console.log('BallotShared componentDidMount');
    window.scrollTo(0, 0);
    this.onAppObservableStoreChange();
    this.onShareStoreChange();
    this.onVoterStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.positionItemTimer = setTimeout(() => {
      // This is a performance killer, so let's delay it for a few seconds
      if (!BallotStore.ballotFound) {
        // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
        if (apiCalming('voterBallotItemsRetrieve', 3000)) {
          BallotActions.voterBallotItemsRetrieve(0, '', '');
        }
      }
    }, 5000);  // April 19, 2021: Tuned to keep performance above 83.  LCP at 597ms

    this.analyticsTimer = setTimeout(() => {
      // AnalyticsActions.saveActionReadyVisit(VoterStore.electionId());
    }, 8000);

    this.preloadTimer = setTimeout(() => lazyPreloadPages(), 2000);
    window.scrollTo(0, 0);
  }

  componentDidUpdate () {
    if (AppObservableStore.isSnackMessagePending()) openSnackbar({});
    // if (cordovaCheckForZeroPageContentContainerPaddingTop()) {
    //   this.setState();
    // }
  }

  componentDidCatch (error, info) {
    console.log('!!!Ready.jsx caught: ', error, info.componentStack);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
    clearTimeout(this.analyticsTimer);
    clearTimeout(this.modalOpenTimer);
    clearTimeout(this.positionItemTimer);
    clearTimeout(this.preloadTimer);
  }

  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    console.log('!!!Error in Ready: ', error);
    return { hasError: true };
  }

  onAppObservableStoreChange () {
    // this.setState({
    //   chosenReadyIntroductionText: AppObservableStore.getChosenReadyIntroductionText(),
    //   chosenReadyIntroductionTitle: AppObservableStore.getChosenReadyIntroductionTitle(),
    // });
  }

  onShareStoreChange () {
    // console.log('SharedItemLanding onShareStoreChange');
    const { sharedItemCodeIncoming } = this.props;
    if (sharedItemCodeIncoming) {
      const sharedItem = ShareStore.getSharedItemByCode(sharedItemCodeIncoming);
      console.log('sharedItem:', sharedItem);
      const {
        shared_by_display_name: sharedByDisplayName,
        shared_by_we_vote_hosted_profile_image_url_large: sharedByImageLarge,
      } = sharedItem;
      this.setState({
        sharedByDisplayName,
        sharedByImageLarge,
      });
    }
  }

  onVoterStoreChange () {
    // console.log('Ready, onVoterStoreChange voter: ', VoterStore.getVoter());
    // this.setState({
    //   voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    // });
  }

  goToBallot = () => {
    historyPush('/ballot');
  }

  getTopPadding = () => {
    if (isWebApp()) {
      return { paddingTop: '0 !important' };
    }
    cordovaSimplePageContainerTopOffset(VoterStore.getVoterIsSignedIn());
    return {};
  }

  toggleSelectBallotModal (showSelectBallotModal, showEditAddress = true) {
    AppObservableStore.setShowSelectBallotModal(!showSelectBallotModal, getBooleanValue(showEditAddress));
  }

  render () {
    renderLog('BallotShared');  // Set LOG_RENDER_EVENTS to log all renders
    const { sharedByDisplayName, sharedByImageLarge } = this.state;
    let htmlTitleText = 'My Voter Guide';
    if (sharedByDisplayName) {
      htmlTitleText = `${sharedByDisplayName}'s Voter Guide`;
    }
    htmlTitleText += ' - We Vote';
    return (
      <PageContentContainer>
        <BallotSharedWrapper className="container-fluid" style={this.getTopPadding()}>
          <SnackNotifier />
          <Helmet title={htmlTitleText} />
          <BrowserPushMessage incomingProps={this.props} />
          <BallotTitleHeaderOuterWrapper>
            <EndorsementTitleSectionWrapper>
              {sharedByImageLarge && (
                <SharedByPhotoImage src={sharedByImageLarge} alt="" />
              )}
              {sharedByDisplayName ? (
                <SharedByDisplayName>
                  {sharedByDisplayName}
                  &apos;s Voter Guide
                </SharedByDisplayName>
              ) : (
                <SharedByDisplayName>
                  My Voter Guide
                </SharedByDisplayName>
              )}
            </EndorsementTitleSectionWrapper>
            <Suspense fallback={<></>}>
              <BallotTitleHeader
                allowTextWrap
                centerText
                electionDateBelow
                toggleSelectBallotModal={this.toggleSelectBallotModal}
              />
            </Suspense>
          </BallotTitleHeaderOuterWrapper>
        </BallotSharedWrapper>
      </PageContentContainer>
    );
  }
}
BallotShared.propTypes = {
  sharedItemCodeIncoming: PropTypes.string,
};

const styles = (theme) => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const BallotSharedWrapper = styled('div')`
`;

const BallotTitleHeaderOuterWrapper = styled('div')`
`;

const SharedByDisplayName = styled('div')`
  font-size: 32px;
  line-height: 1;
  text-align: center;
`;

const SharedByPhotoImage = styled('img')`
  border-radius: 150px;
  max-width: 150px;
`;

const EndorsementTitleSectionWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 32px;
  width: 100%;
`;

export default withTheme(withStyles(styles)(BallotShared));
