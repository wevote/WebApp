import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import AnalyticsActions from '../../actions/AnalyticsActions';
import CandidateActions from '../../actions/CandidateActions';
import ElectionActions from '../../actions/ElectionActions';
import IssueActions from '../../actions/IssueActions';
import OfficeActions from '../../actions/OfficeActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import toTitleCase from '../../common/utils/toTitleCase';
import { DualHeaderContainer, getTopOffsetDueToHeadroomWrapper, HeaderContentContainer, HeaderContentOuterContainer, PageContentContainer } from '../../components/Style/pageLayoutStyles';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import ElectionStore from '../../stores/ElectionStore';
import IssueStore from '../../stores/IssueStore';
import OfficeStore from '../../stores/OfficeStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import apiCalming from '../../common/utils/apiCalming';
import { sortCandidateList } from '../../utils/positionFunctions';
import BallotItemCompressed from '../../components/Ballot/BallotItemCompressed';
import BallotTitleHeader from '../../components/Ballot/BallotTitleHeader';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import BallotActions from '../../actions/BallotActions';


// This is related to pages/VoterGuide/OrganizationVoterGuideOffice
function Office () {
  const params = useParams();
  const [candidateList, setCandidateList] = useState([]);
  const [office, setOffice] = useState({});
  const [election, setElection] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [dummyVariable, setDummyVariable] = useState('');
  const [officeWeVoteId, setOfficeWeVoteId] = useState('');
  // Ref (not state) so the guards update immediately and are visible to the mount-registered store listeners
  const positionListsRequested = useRef({ public: {}, friends: {} });
  const [scrolledDown, setScrolledDown] = useState(false);
  // Store listeners are registered once on mount, so they read current values through these refs
  const candidateListRef = useRef(candidateList);
  candidateListRef.current = candidateList;
  const officeWeVoteIdRef = useRef(officeWeVoteId);
  officeWeVoteIdRef.current = officeWeVoteId;

  const history = useHistory();
  const handleViewBallotClick = () => {
    // window.close();
    history.push('/ballot');
  };

  const retrievePositionListsOnce = (weVoteId) => {
    if (!weVoteId) return;
    const requested = positionListsRequested.current;
    if (!requested.public[weVoteId] && !BallotStore.positionListHasBeenRetrievedOnce(weVoteId)) {
      requested.public[weVoteId] = true;
      OfficeActions.positionListForBallotItemPublic(weVoteId);
    }
    if (!requested.friends[weVoteId] && !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(weVoteId)) {
      requested.friends[weVoteId] = true;
      OfficeActions.positionListForBallotItemFromFriends(weVoteId);
    }
  };

  // Use the election this office belongs to, rather than the voter's current ballot election from BallotStore
  const updateElectionFromOffice = (currentOffice) => {
    const googleCivicElectionId = parseInt(currentOffice?.google_civic_election_id, 10);
    if (!(googleCivicElectionId > 0)) return;
    const foundElection = ElectionStore.getElectionByGoogleCivicElectionId(googleCivicElectionId);
    if (foundElection && foundElection.election_name) {
      setElection(foundElection);
    } else if (apiCalming('electionsRetrieve', 60000)) {
      ElectionActions.electionsRetrieve();
    }
  };

  const onElectionStoreChange = () => {
    updateElectionFromOffice(OfficeStore.getOffice(officeWeVoteIdRef.current || params.office_we_vote_id));
  };

  const onAppObservableStoreChange = useCallback(() => {
    // We update dummyVariable so we can force a re-render of the component,
    //  which is necessary to pick up an AppObservableStore update that changes
    //  getPaddingTop in PageContentContainer
    setScrolledDown(AppObservableStore.getScrolledDown());
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    setDummyVariable(formattedTime);
  }, []);

  const onCandidateStoreChange = () => {
    let currentOfficeWeVoteId = officeWeVoteIdRef.current;
    if (!currentOfficeWeVoteId) {
      currentOfficeWeVoteId = params.office_we_vote_id;
    }
    const currentCandidateList = candidateListRef.current;
    let newCandidate;
    let newCandidateList = [];
    if (currentCandidateList && currentCandidateList.length > 0 && currentOfficeWeVoteId) {
      // console.log('In candidateList loop');
      currentCandidateList.forEach((candidate) => {
        if (candidate && candidate.we_vote_id) {
          newCandidate = CandidateStore.getCandidateByWeVoteId(candidate.we_vote_id);
          if (newCandidate && newCandidate.we_vote_id) {
            newCandidateList.push(newCandidate);
          } else {
            newCandidateList.push(candidate);
          }
        }
      });
      // Pick up candidates the store has added for this office since our list was built
      const knownWeVoteIds = new Set(newCandidateList.map((candidate) => candidate.we_vote_id));
      CandidateStore.getCandidateListByOfficeWeVoteId(currentOfficeWeVoteId).forEach((candidate) => {
        if (candidate && candidate.we_vote_id && !knownWeVoteIds.has(candidate.we_vote_id)) {
          newCandidateList.push(candidate);
        }
      });
      setCandidateList(sortCandidateList(newCandidateList));
      retrievePositionListsOnce(currentOfficeWeVoteId);
    } else {
      const rawCandidateList = CandidateStore.getCandidateListByOfficeWeVoteId(currentOfficeWeVoteId);
      newCandidateList = sortCandidateList(rawCandidateList);
      setCandidateList(newCandidateList);
    }
  };

  const onOfficeStoreChange = () => {
    let currentOfficeWeVoteId = officeWeVoteIdRef.current;
    if (!currentOfficeWeVoteId) {
      currentOfficeWeVoteId = params.office_we_vote_id;
    }
    const currentOffice = OfficeStore.getOffice(currentOfficeWeVoteId);
    console.log('Office.jsx onOfficeStoreChange:', currentOfficeWeVoteId, ', office:', currentOffice);
    let newCandidate;
    const newCandidateList = [];
    if (currentOffice && currentOffice.ballot_item_display_name) {
      let { candidate_list: currentCandidateList } = currentOffice;
      if (currentCandidateList && currentCandidateList.length > 0 && currentOfficeWeVoteId) {
        // console.log('In Office candidateList loop');
        currentCandidateList.forEach((candidate) => {
          if (candidate && candidate.we_vote_id) {
            newCandidate = CandidateStore.getCandidateByWeVoteId(candidate.we_vote_id);
            if (newCandidate && newCandidate.we_vote_id) {
              newCandidateList.push(newCandidate);
            } else {
              newCandidateList.push(candidate);
            }
          }
        });
        currentCandidateList = sortCandidateList(newCandidateList);
        setCandidateList(currentCandidateList);
      }
      retrievePositionListsOnce(currentOfficeWeVoteId);
      updateElectionFromOffice(currentOffice);
      setOffice(currentOffice);
      setOfficeWeVoteId(currentOfficeWeVoteId);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const currentOfficeWeVoteId = params.office_we_vote_id;
    const currentOffice = OfficeStore.getOffice(currentOfficeWeVoteId);
    // console.log('officeWeVoteId:', currentOfficeWeVoteId, ', office:', currentOffice);
    if (currentOffice && currentOffice.ballot_item_display_name && currentOffice.candidate_list) {
      let { candidate_list: currentCandidateList } = currentOffice;
      // console.log('componentDidMount office:', currentOffice);
      if (currentCandidateList && currentCandidateList.length && currentOfficeWeVoteId) {
        currentCandidateList = sortCandidateList(currentCandidateList);
        retrievePositionListsOnce(currentOfficeWeVoteId);
      } else {
        // console.log('Calling candidatesRetrieve, officeWeVoteId:', currentOfficeWeVoteId);
        CandidateActions.candidatesRetrieve(currentOfficeWeVoteId);
      }
      setCandidateList(currentCandidateList);
      updateElectionFromOffice(currentOffice);
      setOffice(currentOffice);
    } else if (currentOfficeWeVoteId) {
      OfficeActions.officeRetrieve(currentOfficeWeVoteId);
      CandidateActions.candidatesRetrieve(currentOfficeWeVoteId);
      // console.log('componentDidMount officeRetrieve, officeWeVoteId:', currentOfficeWeVoteId);
    } else {
      // console.log('componentDidMount Missing officeWeVoteId');
    }

    if (currentOfficeWeVoteId) {
      setOfficeWeVoteId(currentOfficeWeVoteId);
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

    if (apiCalming('activityNoticeListRetrieve', 10000)) {
      ActivityActions.activityNoticeListRetrieve();
    }

    if (apiCalming('voterBallotItemsRetrieve', 600000)) {
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }

    AnalyticsActions.saveActionOffice(VoterStore.electionId(), params.office_we_vote_id);

    const candidateStoreListener = CandidateStore.addListener(onCandidateStoreChange);
    const officeStoreListener = OfficeStore.addListener(onOfficeStoreChange);
    const electionStoreListener = ElectionStore.addListener(onElectionStoreChange);

    return () => {
      candidateStoreListener.remove();
      officeStoreListener.remove();
      electionStoreListener.remove();
    };
  }, []); // Empty dependency array for mount/unmount only

  useEffect(() => {
    const modalToOpen = params.modal_to_show || '';
    let modalOpenTimer;

    if (modalToOpen === 'share') {
      modalOpenTimer = setTimeout(() => {
        AppObservableStore.setShowShareModal(true);
      }, 1000);
    } else if (modalToOpen === 'sic') { // sic = Shared Item Code
      const sharedItemCode = params.shared_item_code || '';
      if (sharedItemCode) {
        modalOpenTimer = setTimeout(() => {
          AppObservableStore.setShowSharedItemModal(sharedItemCode);
        }, 1000);
      }
    }

    return () => {
      if (modalOpenTimer) clearTimeout(modalOpenTimer);
    };
  }, [params.modal_to_show, params.shared_item_code]);

  useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(onAppObservableStoreChange);
    onAppObservableStoreChange();
    return () => {
      appStateSubscription.unsubscribe();
    };
  }, [onAppObservableStoreChange]);

  renderLog('Office');  // Set LOG_RENDER_EVENTS to log all renders
  // console.log('Office.jsx office:', office, ', candidateList:', candidateList);

  if (!office || !office.ballot_item_display_name) {
    // TODO DALE If the officeWeVoteId is not valid, we need to update this with a notice
    return (
      <div className="container-fluid well u-stack--md u-inset--md">
        <div>{LoadingWheel}</div>
        <br />
      </div>
    );
  }

  const officeName = toTitleCase(office.ballot_item_display_name);
  const titleText = `${officeName} - WeVote`;
  const descriptionText = `Choose who you support for ${officeName} in this election`;

  return (
    <>
      <Helmet
        title={titleText}
        meta={[{ name: 'description', content: descriptionText }]}
      />
      <DualHeaderContainer id="ballot" scrolledDown={scrolledDown} topOffset={getTopOffsetDueToHeadroomWrapper()}>
        <HeaderContentOuterContainer>
          <HeaderContentContainer>
            <div className="col-md-12">
              <header className="ballot__header__group">
                <BallotTitleHeaderContainer>
                  <BallotTitleHeader
                    showShareButton={false}
                    officeName={officeName}
                    electionId={election.google_civic_election_id}
                    // electionName={election.election_name}
                    // electionDayText={election.election_day_text}
                    linksOff
                    allowTextWrap
                    onViewBallotClick={handleViewBallotClick}
                  />
                </BallotTitleHeaderContainer>
              </header>
            </div>
          </HeaderContentContainer>
        </HeaderContentOuterContainer>
        <hr className="office-header-divider" />
      </DualHeaderContainer>
      <PageContentContainer>
        <div className="container-fluid">
          <OfficeWrapper>
            <Suspense fallback={<></>}>
              <BallotItemCompressed
                ballotItemDisplayName={office.ballot_item_display_name}
                candidateList={candidateList}
                // candidatesToShowForSearchResults={item.candidatesToShowForSearchResults}
                // foundInSearchWords={item.foundInSearchWords}
                // id={chipLabelText(item.ballot_item_display_name)}
                // isFirstBallotItem={isFirstBallotItem}
                // isMeasure={item.kind_of_ballot_item === TYPES.MEASURE}
                officeExplanation={office.office_explanation_text}
                // primaryParty={item.primary_party}
                // totalNumberOfBallotItems={totalNumberOfBallotItems}
                useHelpDefeatOrHelpWin
                videoUrlHorizontal={office.video_url_horizontal}
                videoUrlVertical={office.video_url_vertical}
                weVoteId={office.we_vote_id}
              // key={key}
              />
            </Suspense>
          </OfficeWrapper>
        </div>
      </PageContentContainer>
    </>
  );
}
Office.propTypes = {
  // match: PropTypes.object.isRequired,
};

const OfficeWrapper = styled('div')(({ theme }) => (`
  padding-top: 100px;
  margin: 0 15px;
  ${theme.breakpoints.down('sm')} {
    padding-top: 160px;
  }
`));

const BallotTitleHeaderContainer = styled('div')`
  margin-top: 50px;
  transition: ${isWebApp() ? 'all 150ms ease-in' : ''};
`;

export default Office;

