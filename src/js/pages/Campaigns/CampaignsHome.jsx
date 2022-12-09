import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import AnalyticsActions from '../../actions/AnalyticsActions';
import CandidateActions from '../../actions/CandidateActions';
import IssueActions from '../../actions/IssueActions';
import OfficeActions from '../../actions/OfficeActions';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import toTitleCase from '../../common/utils/toTitleCase';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import AppObservableStore from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import OfficeStore from '../../stores/OfficeStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import apiCalming from '../../common/utils/apiCalming';
import { cordovaSimplePageContainerTopOffset } from '../../utils/cordovaCalculatedOffsets';
import { sortCandidateList } from '../../utils/positionFunctions';

const CampaignList = React.lazy(() => import(/* webpackChunkName: 'CampaignList' */ '../../common/components/Campaign/CampaignList'));

class CampaignsHome extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidateList: [],
      office: {},
      officeWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    const { match: { params } } = this.props;
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.officeStoreListener = OfficeStore.addListener(this.onOfficeStoreChange.bind(this));
    const officeWeVoteId = params.office_we_vote_id;
    const office = OfficeStore.getOffice(officeWeVoteId);
    // console.log('officeWeVoteId:', officeWeVoteId, ', office:', office);
    if (office && office.ballot_item_display_name && office.candidate_list) {
      let { candidate_list: candidateList } = office;
      // console.log('componentDidMount office:', office);
      if (candidateList && candidateList.length && officeWeVoteId) {
        candidateList = sortCandidateList(candidateList);
        if (officeWeVoteId &&
          !this.localPositionListHasBeenRetrievedOnce(officeWeVoteId) &&
          !BallotStore.positionListHasBeenRetrievedOnce(officeWeVoteId)
        ) {
          OfficeActions.positionListForBallotItemPublic(officeWeVoteId);
          const { positionListHasBeenRetrievedOnce } = this.state;
          positionListHasBeenRetrievedOnce[officeWeVoteId] = true;
          this.setState({
            positionListHasBeenRetrievedOnce,
          });
        }
        if (officeWeVoteId &&
          !this.localPositionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId) &&
          !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId)
        ) {
          OfficeActions.positionListForBallotItemFromFriends(officeWeVoteId);
          const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
          positionListFromFriendsHasBeenRetrievedOnce[officeWeVoteId] = true;
          this.setState({
            positionListFromFriendsHasBeenRetrievedOnce,
          });
        }
      } else {
        // console.log('Calling candidatesRetrieve, officeWeVoteId:', officeWeVoteId);
        CandidateActions.candidatesRetrieve(officeWeVoteId);
      }
      this.setState({
        candidateList,
        office,
      });
    } else if (officeWeVoteId) {
      OfficeActions.officeRetrieve(officeWeVoteId);
      CandidateActions.candidatesRetrieve(officeWeVoteId);
      // console.log('componentDidMount officeRetrieve, officeWeVoteId:', officeWeVoteId);
    } else {
      // console.log('componentDidMount Missing officeWeVoteId');
    }

    if (officeWeVoteId) {
      this.setState({
        officeWeVoteId,
      });
    }

    if (apiCalming('issueDescriptionsRetrieve', 3600000)) { // Only once per 60 minutes
      IssueActions.issueDescriptionsRetrieve();
    }
    if (apiCalming('issuesFollowedRetrieve', 60000)) { // Only once per minute
      IssueActions.issuesFollowedRetrieve();
    }
    if (VoterStore.electionId() && !IssueStore.issuesUnderBallotItemsRetrieveCalled(VoterStore.electionId())) {
      IssueActions.issuesUnderBallotItemsRetrieve(VoterStore.electionId());
    }
    const modalToOpen = params.modal_to_show || '';
    if (modalToOpen === 'share') {
      this.modalOpenTimer = setTimeout(() => {
        AppObservableStore.setShowShareModal(true);
      }, 1000);
    } else if (modalToOpen === 'sic') { // sic = Shared Item Code
      const sharedItemCode = params.shared_item_code || '';
      if (sharedItemCode) {
        this.modalOpenTimer = setTimeout(() => {
          AppObservableStore.setShowSharedItemModal(sharedItemCode);
        }, 1000);
      }
    }
    if (apiCalming('activityNoticeListRetrieve', 10000)) {
      ActivityActions.activityNoticeListRetrieve();
    }
    AnalyticsActions.saveActionOffice(VoterStore.electionId(), params.office_we_vote_id);
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.officeStoreListener.remove();
    if (this.modalOpenTimer) clearTimeout(this.modalOpenTimer);
  }

  onCandidateStoreChange () {
    const { match: { params } } = this.props;
    let { candidateList } = this.state;
    let { officeWeVoteId } = this.state;
    if (!officeWeVoteId) {
      officeWeVoteId = params.office_we_vote_id;
    }
    // console.log('onCandidateStoreChange officeWeVoteId:', officeWeVoteId, ', candidateList:', candidateList);
    let newCandidate;
    let newCandidateList = [];
    if (candidateList && candidateList.length > 0 && officeWeVoteId) {
      // console.log('In candidateList loop');
      candidateList.forEach((candidate) => {
        if (candidate && candidate.we_vote_id) {
          newCandidate = CandidateStore.getCandidate(candidate.we_vote_id);
          if (newCandidate && newCandidate.we_vote_id) {
            newCandidateList.push(newCandidate);
          } else {
            newCandidateList.push(candidate);
          }
        }
      });
      candidateList = sortCandidateList(newCandidateList);
      // console.log('onCandidateStoreChange from state, candidateList:', candidateList);
      this.setState({
        candidateList,
      });
      if (officeWeVoteId &&
        !this.localPositionListHasBeenRetrievedOnce(officeWeVoteId) &&
        !BallotStore.positionListHasBeenRetrievedOnce(officeWeVoteId)
      ) {
        OfficeActions.positionListForBallotItemPublic(officeWeVoteId);
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[officeWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
      if (officeWeVoteId &&
        !this.localPositionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId)
      ) {
        OfficeActions.positionListForBallotItemFromFriends(officeWeVoteId);
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[officeWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
    } else {
      // console.log('getCandidateListByOfficeWeVoteId, officeWeVoteId:', officeWeVoteId);
      const rawCandidateList = CandidateStore.getCandidateListByOfficeWeVoteId(officeWeVoteId);
      // console.log('getCandidateListByOfficeWeVoteId, rawCandidateList:', rawCandidateList);
      newCandidateList = sortCandidateList(rawCandidateList);
      this.setState({
        candidateList: newCandidateList,
      });
    }
  }

  onOfficeStoreChange () {
    const { match: { params } } = this.props;
    let { officeWeVoteId } = this.state;
    if (!officeWeVoteId) {
      officeWeVoteId = params.office_we_vote_id;
    }
    const office = OfficeStore.getOffice(officeWeVoteId);
    // console.log('CampaignsHome.jsx onOfficeStoreChange:', officeWeVoteId, ', office:', office);
    let newCandidate;
    const newCandidateList = [];
    if (office && office.ballot_item_display_name) {
      let { candidate_list: candidateList } = office;
      if (candidateList && candidateList.length > 0 && officeWeVoteId) {
        // console.log('In CampaignsHome candidateList loop');
        candidateList.forEach((candidate) => {
          if (candidate && candidate.we_vote_id) {
            newCandidate = CandidateStore.getCandidate(candidate.we_vote_id);
            if (newCandidate && newCandidate.we_vote_id) {
              newCandidateList.push(newCandidate);
            } else {
              newCandidateList.push(candidate);
            }
          }
        });
        candidateList = sortCandidateList(newCandidateList);
        this.setState({
          candidateList,
        });

        if (officeWeVoteId &&
          !this.localPositionListHasBeenRetrievedOnce(officeWeVoteId) &&
          !BallotStore.positionListHasBeenRetrievedOnce(officeWeVoteId)
        ) {
          OfficeActions.positionListForBallotItemPublic(officeWeVoteId);
          const { positionListHasBeenRetrievedOnce } = this.state;
          positionListHasBeenRetrievedOnce[officeWeVoteId] = true;
          this.setState({
            positionListHasBeenRetrievedOnce,
          });
        }
      }
      if (officeWeVoteId &&
        !this.localPositionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId)
      ) {
        OfficeActions.positionListForBallotItemFromFriends(officeWeVoteId);
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[officeWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
      this.setState({
        office,
        officeWeVoteId,
      });
    }
  }

  localPositionListHasBeenRetrievedOnce (officeWeVoteId) {
    if (officeWeVoteId) {
      const { positionListHasBeenRetrievedOnce } = this.state;
      return positionListHasBeenRetrievedOnce[officeWeVoteId];
    }
    return false;
  }

  localPositionListFromFriendsHasBeenRetrievedOnce (officeWeVoteId) {
    if (officeWeVoteId) {
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      return positionListFromFriendsHasBeenRetrievedOnce[officeWeVoteId];
    }
    return false;
  }

  getTopPadding = () => {
    if (isWebApp()) {
      return { paddingTop: '0 !important' };
    }
    cordovaSimplePageContainerTopOffset(VoterStore.getVoterIsSignedIn());
    return {};
  }

  render () {
    renderLog('CampaignsHome');  // Set LOG_RENDER_EVENTS to log all renders
    const { office } = this.state;
    // console.log('CampaignsHome.jsx office:', office, ', candidateList:', candidateList);

    const officeName = toTitleCase(office.ballot_item_display_name);
    const titleText = `${officeName} - We Vote`;
    const descriptionText = `Choose who you support for ${officeName} in this election`;


    return (
      <PageContentContainer>
        <CampaignsHomeContainer className="container-fluid" style={this.getTopPadding()}>
          <Helmet
            title={titleText}
            meta={[{ name: 'description', content: descriptionText }]}
          />
          <WhatIsHappeningSection>
            <Suspense fallback={<span>&nbsp;</span>}>
              <CampaignList titleTextIfCampaigns="Sponsored Campaigns" />
            </Suspense>
          </WhatIsHappeningSection>
        </CampaignsHomeContainer>
      </PageContentContainer>
    );
  }
}
CampaignsHome.propTypes = {
  match: PropTypes.object.isRequired,
};

const CampaignsHomeContainer = styled('div')`
`;

const WhatIsHappeningSection = styled('div')`
  margin: 0 0 25px 0;
`;

export default CampaignsHome;

