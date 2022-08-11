import { Reply } from '@mui/icons-material';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import ShareActions from '../../common/actions/ShareActions';
import historyPush from '../../common/utils/historyPush';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';

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
    let shareModalStep;
    if (candidateShare) {
      kindOfShare = 'CANDIDATE';
      if (withOpinionsModified) {
        shareModalStep = 'candidateShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareCandidateAllOpinions(VoterStore.electionId());
      } else {
        shareModalStep = 'candidateShareOptions';
        AnalyticsActions.saveActionShareCandidate(VoterStore.electionId());
      }
    } else if (measureShare) {
      kindOfShare = 'MEASURE';
      if (withOpinionsModified) {
        shareModalStep = 'measureShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareMeasureAllOpinions(VoterStore.electionId());
      } else {
        shareModalStep = 'measureShareOptions';
        AnalyticsActions.saveActionShareMeasure(VoterStore.electionId());
      }
    } else if (officeShare) {
      kindOfShare = 'OFFICE';
      if (withOpinionsModified) {
        shareModalStep = 'officeShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareOfficeAllOpinions(VoterStore.electionId());
      } else {
        shareModalStep = 'officeShareOptions';
        AnalyticsActions.saveActionShareOffice(VoterStore.electionId());
      }
    } else if (organizationShare) {
      kindOfShare = 'ORGANIZATION';
      if (withOpinionsModified) {
        shareModalStep = 'organizationShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareOrganizationAllOpinions(VoterStore.electionId());
      } else {
        shareModalStep = 'organizationShareOptions';
        AnalyticsActions.saveActionShareOrganization(VoterStore.electionId());
      }
    } else if (readyShare) {
      kindOfShare = 'READY';
      if (withOpinionsModified) {
        shareModalStep = 'readyShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareReadyAllOpinions(VoterStore.electionId());
      } else {
        shareModalStep = 'readyShareOptions';
        AnalyticsActions.saveActionShareReady(VoterStore.electionId());
      }
      // Default to ballot
    } else if (withOpinionsModified) {
      shareModalStep = 'ballotShareOptionsAllOpinions';
      AnalyticsActions.saveActionShareBallotAllOpinions(VoterStore.electionId());
    } else {
      shareModalStep = 'ballotShareOptions';
      AnalyticsActions.saveActionShareBallot(VoterStore.electionId());
    }

    ShareActions.sharedItemSave(destinationFullUrl, kindOfShare, ballotItemWeVoteId, googleCivicElectionId, organizationWeVoteId);
    AppObservableStore.setShowShareModal(true);
    AppObservableStore.setShareModalStep(shareModalStep);
    const { pathname } = window.location;
    if (!stringContains('/modal/share', pathname) && isWebApp()) {
      const pathnameWithModalShare = `${pathname}${pathname.endsWith('/') ? '' : '/'}modal/share`;
      // console.log('Navigation ShareButtonDesktopTablet openShareModal ', pathnameWithModalShare)
      historyPush(pathnameWithModalShare);
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
