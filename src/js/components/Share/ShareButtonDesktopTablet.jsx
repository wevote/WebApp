import { Reply } from '@mui/icons-material';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import ShareActions from '../../common/actions/ShareActions';
import historyPush from '../../common/utils/historyPush';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import VoterStore from '../../stores/VoterStore';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';

class ShareButtonDesktopTablet extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    const chosenPreventSharingOpinions = AppObservableStore.getChosenPreventSharingOpinions();
    this.setState({
      chosenPreventSharingOpinions,
    });
    // dumpObjProps('cookies in ShareButtonDesktopTablet: ', cookies.keys);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const chosenPreventSharingOpinions = AppObservableStore.getChosenPreventSharingOpinions();
    this.setState({
      chosenPreventSharingOpinions,
    });
  }

  openShareModal (withOpinions = false) {
    const { candidateShare, measureShare, officeShare, organizationShare, organizationWeVoteId, readyShare } = this.props;
    const { chosenPreventSharingOpinions } = this.state;
    let withOpinionsModified = withOpinions;
    if (chosenPreventSharingOpinions) {
      withOpinionsModified = false;
    }
    const ballotItemWeVoteId = '';
    const { href: destinationFullUrl } = window.location;
    const googleCivicElectionId = 0;
    let kindOfShare = 'BALLOT';
    let whatAndHowMuchToShare;

    // Add debug logging
    // console.log('Share button clicked');
    // console.log('Current pathname:', window.location.pathname);
    // console.log('VoterWeVoteId:', VoterStore.getVoterWeVoteId());

    if (candidateShare) {
      kindOfShare = 'CANDIDATE';
      if (withOpinionsModified) {
        whatAndHowMuchToShare = 'candidateShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareCandidateAllOpinions(VoterStore.electionId());
      } else {
        whatAndHowMuchToShare = 'candidateShareOptions';
        AnalyticsActions.saveActionShareCandidate(VoterStore.electionId());
      }
    } else if (measureShare) {
      kindOfShare = 'MEASURE';
      if (withOpinionsModified) {
        whatAndHowMuchToShare = 'measureShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareMeasureAllOpinions(VoterStore.electionId());
      } else {
        whatAndHowMuchToShare = 'measureShareOptions';
        AnalyticsActions.saveActionShareMeasure(VoterStore.electionId());
      }
    } else if (officeShare) {
      kindOfShare = 'OFFICE';
      if (withOpinionsModified) {
        whatAndHowMuchToShare = 'officeShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareOfficeAllOpinions(VoterStore.electionId());
      } else {
        whatAndHowMuchToShare = 'officeShareOptions';
        AnalyticsActions.saveActionShareOffice(VoterStore.electionId());
      }
    } else if (organizationShare) {
      kindOfShare = 'ORGANIZATION';
      if (withOpinionsModified) {
        whatAndHowMuchToShare = 'organizationShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareOrganizationAllOpinions(VoterStore.electionId());
      } else {
        whatAndHowMuchToShare = 'organizationShareOptions';
        AnalyticsActions.saveActionShareOrganization(VoterStore.electionId());
      }
    } else if (readyShare) {
      kindOfShare = 'READY';
      if (withOpinionsModified) {
        whatAndHowMuchToShare = 'readyShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareReadyAllOpinions(VoterStore.electionId());
      } else {
        whatAndHowMuchToShare = 'readyShareOptions';
        AnalyticsActions.saveActionShareReady(VoterStore.electionId());
      }
      // Default to ballot
    } else if (withOpinionsModified) {
      whatAndHowMuchToShare = 'ballotShareOptionsAllOpinions';
      AnalyticsActions.saveActionShareBallotAllOpinions(VoterStore.electionId());
    } else {
      whatAndHowMuchToShare = 'ballotShareOptions';
      AnalyticsActions.saveActionShareBallot(VoterStore.electionId());
    }

    // Calculate pathnameWithModalShare for dataLayer tracking
    const { pathname } = window.location;
    let pathnameWithModalShare = pathname;
    if (!stringContains('/modal/share', pathname) && isWebApp()) {
      pathnameWithModalShare = `${pathname}${pathname.endsWith('/') ? '' : '/'}modal/share`;
    }

    // Add dataLayer tracking after kindOfShare and whatAndHowMuchToShare are calculated
    const destinationPage = lookupPageNameAndPageTypeDict(pathnameWithModalShare);

    // Determine buttonId based on kindOfShare
    let buttonId;
    switch (kindOfShare) {
      case 'CANDIDATE':
        buttonId = 'candidateShareButtonDesktopTablet';
        break;
      case 'MEASURE':
        buttonId = 'measureShareButtonDesktopTablet';
        break;
      case 'OFFICE':
        buttonId = 'officeShareButtonDesktopTablet';
        break;
      case 'ORGANIZATION':
        buttonId = 'organizationShareButtonDesktopTablet';
        break;
      case 'READY':
        buttonId = 'readyShareButtonDesktopTablet';
        break;
      default:
        buttonId = 'ballotShareButtonDesktopTablet';
    }

    const dataLayerObject = {
      event: 'action',
      userDetails: VoterStore.getAnalyticsUserDetails(),
      actionDetails: {
        actionType: 'openModal',
        buttonId,
      },
      shareDetails: {
        kindOfShare,
        withOpinions: withOpinionsModified,
        whatAndHowMuchToShare,
      },
      pageDetails: getPageDetails(),
      destinationDetails: {
        destinationPageName: destinationPage.pageName,
        destinationPageType: destinationPage.pageType,
        destinationPathname: pathnameWithModalShare,
      },
    };
    const electionDetails = BallotStore.getAnalyticsElectionDetails();
    if (electionDetails && electionDetails.electionDate) {
      dataLayerObject.electionDetails = electionDetails;
    }
    // console.log('Pushing to dataLayer:', dataLayerObject);
    TagManager.dataLayer({ dataLayer: dataLayerObject });

    ShareActions.sharedItemSave(destinationFullUrl, kindOfShare, ballotItemWeVoteId, googleCivicElectionId, organizationWeVoteId);
    AppObservableStore.setShowShareModal(true);
    AppObservableStore.setWhatAndHowMuchToShare(whatAndHowMuchToShare);
    if (!stringContains('/modal/share', pathname) && isWebApp()) {
      // console.log('Navigation ShareButtonDesktopTablet openShareModal ', pathnameWithModalShare)
      historyPush(pathnameWithModalShare, false, true);
    }
  }

  render () {
    renderLog('ShareButtonDesktopTablet');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      candidateShare, classes, measureShare, officeShare,
      organizationShare, readyShare, shareButtonText,
    } = this.props;
    const { chosenPreventSharingOpinions } = this.state;
    const withOpinions = !chosenPreventSharingOpinions;  // Default true, but turn off if prevented

    let shareButtonClasses;
    if (candidateShare) {
      shareButtonClasses = classes.buttonCandidate;
    } else if (measureShare) {
      shareButtonClasses = classes.buttonCandidate;
    } else if (officeShare) {
      shareButtonClasses = classes.buttonCandidate;
    } else if (organizationShare) {
      shareButtonClasses = classes.buttonCandidate;
    } else if (readyShare) {
      shareButtonClasses = classes.buttonDefault;
    } else {
      // Default to ballot
      shareButtonClasses = classes.buttonDefault;
    }
    return (
      <>
        <Button
          classes={{ root: shareButtonClasses }}
          color="primary"
          id="shareButtonDesktopTablet"
          onClick={() => this.openShareModal(withOpinions)}
          variant="contained"
        >
          <Icon>
            <Reply
              classes={{ root: classes.shareIcon }}
            />
          </Icon>
          <span className="u-no-break">{shareButtonText || 'Share'}</span>
        </Button>
      </>
    );
  }
}
ShareButtonDesktopTablet.propTypes = {
  classes: PropTypes.object,
  candidateShare: PropTypes.bool,
  measureShare: PropTypes.bool,
  officeShare: PropTypes.bool,
  organizationShare: PropTypes.bool,
  organizationWeVoteId: PropTypes.string,
  readyShare: PropTypes.bool,
  shareButtonText: PropTypes.string,
};

const styles = () => ({
  paper: {
    borderRadius: '2px !important',
    marginTop: '10px !important',
    overflowX: 'visible !important',
    overflowY: 'visible !important',
  },
  buttonDefault: {
    padding: '4px 18px 2px 12px',
  },
  buttonCandidate: {
    padding: '2px 12px',
    width: 160,
  },
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 3,
  },
  informationIconInButton: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginLeft: 3,
  },
  menuItem: {
    zIndex: '9 !important',
    padding: '0 !important',
    marginBottom: '-2px !important',
    overflowWrap: 'break-word',
    paddingBottom: '1px !important',
    '&:last-child': {
      paddingBottom: '0 !important',
      paddingTop: '1px !important',
    },
    '&:hover': {
      background: '#efefef',
    },
  },
  shareIcon: {
    transform: 'scaleX(-1)',
    position: 'relative',
    top: -1,
  },
  toolTip: {
    zIndex: '5030 !important',
  },
});

const Icon = styled('span')`
  margin-right: 4px;
`;

export default withStyles(styles)(ShareButtonDesktopTablet);
