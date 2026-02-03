import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import AnalyticsActions from '../../actions/AnalyticsActions';
import CandidateActions from '../../actions/CandidateActions';
import IssueActions from '../../actions/IssueActions';
import OfficeActions from '../../actions/OfficeActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import toTitleCase from '../../common/utils/toTitleCase';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import OfficeStore from '../../stores/OfficeStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import apiCalming from '../../common/utils/apiCalming';
import { sortCandidateList } from '../../utils/positionFunctions';
import BallotItemCompressed from '../../components/Ballot/BallotItemCompressed';


// This is related to pages/VoterGuide/OrganizationVoterGuideOffice
const Office = () => {
  const params = useParams();
  const [candidateList, setCandidateList] = useState([]);
  const [office, setOffice] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [dummyVariable, setDummyVariable] = useState('');
  const [officeWeVoteId, setOfficeWeVoteId] = useState('');
  const [positionListFromFriendsHasBeenRetrievedOnce, setPositionListFromFriendsHasBeenRetrievedOnce] = useState({});
  const [positionListHasBeenRetrievedOnce, setPositionListHasBeenRetrievedOnce] = useState({});

  const localPositionListHasBeenRetrievedOnce = (weVoteId) => {
    if (weVoteId) {
      return positionListHasBeenRetrievedOnce[weVoteId];
    }
    return false;
  };

  const localPositionListFromFriendsHasBeenRetrievedOnce = (weVoteId) => {
    if (weVoteId) {
      return positionListFromFriendsHasBeenRetrievedOnce[weVoteId];
    }
    return false;
  };

  const onAppObservableStoreChange = useCallback(() => {
    // We update dummyVariable so we can force a re-render of the component,
    //  which is necessary to pick up an AppObservableStore update that changes
    //  getPaddingTop in PageContentContainer
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    setDummyVariable(formattedTime);
  }, []);

  const onCandidateStoreChange = () => {
    let currentOfficeWeVoteId = officeWeVoteId;
    if (!currentOfficeWeVoteId) {
      currentOfficeWeVoteId = params.office_we_vote_id;
    }
    // console.log('onCandidateStoreChange officeWeVoteId:', currentOfficeWeVoteId, ', candidateList:', candidateList);
    let newCandidate;
    let newCandidateList = [];
    if (candidateList && candidateList.length > 0 && currentOfficeWeVoteId) {
      // console.log('In candidateList loop');
      candidateList.forEach((candidate) => {
        if (candidate && candidate.we_vote_id) {
          newCandidate = CandidateStore.getCandidateByWeVoteId(candidate.we_vote_id);
          if (newCandidate && newCandidate.we_vote_id) {
            newCandidateList.push(newCandidate);
          } else {
            newCandidateList.push(candidate);
          }
        }
      });
      const sortedList = sortCandidateList(newCandidateList);
      // console.log('onCandidateStoreChange from state, candidateList:', sortedList);
      setCandidateList(sortedList);
      if (currentOfficeWeVoteId &&
        !localPositionListHasBeenRetrievedOnce(currentOfficeWeVoteId) &&
        !BallotStore.positionListHasBeenRetrievedOnce(currentOfficeWeVoteId)
      ) {
        OfficeActions.positionListForBallotItemPublic(currentOfficeWeVoteId);
        setPositionListHasBeenRetrievedOnce((prev) => ({
          ...prev,
          [currentOfficeWeVoteId]: true,
        }));
      }
      if (currentOfficeWeVoteId &&
        !localPositionListFromFriendsHasBeenRetrievedOnce(currentOfficeWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(currentOfficeWeVoteId)
      ) {
        OfficeActions.positionListForBallotItemFromFriends(currentOfficeWeVoteId);
        setPositionListFromFriendsHasBeenRetrievedOnce((prev) => ({
          ...prev,
          [currentOfficeWeVoteId]: true,
        }));
      }
    } else {
      // console.log('getCandidateListByOfficeWeVoteId, officeWeVoteId:', currentOfficeWeVoteId);
      const rawCandidateList = CandidateStore.getCandidateListByOfficeWeVoteId(currentOfficeWeVoteId);
      // console.log('getCandidateListByOfficeWeVoteId, rawCandidateList:', rawCandidateList);
      newCandidateList = sortCandidateList(rawCandidateList);
      setCandidateList(newCandidateList);
    }
  };

  const onOfficeStoreChange = () => {
    let currentOfficeWeVoteId = officeWeVoteId;
    if (!currentOfficeWeVoteId) {
      currentOfficeWeVoteId = params.office_we_vote_id;
    }
    const currentOffice = OfficeStore.getOffice(currentOfficeWeVoteId);
    // console.log('Office.jsx onOfficeStoreChange:', currentOfficeWeVoteId, ', office:', currentOffice);
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

        if (currentOfficeWeVoteId &&
          !localPositionListHasBeenRetrievedOnce(currentOfficeWeVoteId) &&
          !BallotStore.positionListHasBeenRetrievedOnce(currentOfficeWeVoteId)
        ) {
          OfficeActions.positionListForBallotItemPublic(currentOfficeWeVoteId);
          setPositionListHasBeenRetrievedOnce((prev) => ({
            ...prev,
            [currentOfficeWeVoteId]: true,
          }));
        }
      }
      if (currentOfficeWeVoteId &&
        !localPositionListFromFriendsHasBeenRetrievedOnce(currentOfficeWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(currentOfficeWeVoteId)
      ) {
        OfficeActions.positionListForBallotItemFromFriends(currentOfficeWeVoteId);
        setPositionListFromFriendsHasBeenRetrievedOnce((prev) => ({
          ...prev,
          [currentOfficeWeVoteId]: true,
        }));
      }
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
        if (currentOfficeWeVoteId &&
          !localPositionListHasBeenRetrievedOnce(currentOfficeWeVoteId) &&
          !BallotStore.positionListHasBeenRetrievedOnce(currentOfficeWeVoteId)
        ) {
          OfficeActions.positionListForBallotItemPublic(currentOfficeWeVoteId);
          setPositionListHasBeenRetrievedOnce((prev) => ({
            ...prev,
            [currentOfficeWeVoteId]: true,
          }));
        }
        if (currentOfficeWeVoteId &&
          !localPositionListFromFriendsHasBeenRetrievedOnce(currentOfficeWeVoteId) &&
          !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(currentOfficeWeVoteId)
        ) {
          OfficeActions.positionListForBallotItemFromFriends(currentOfficeWeVoteId);
          setPositionListFromFriendsHasBeenRetrievedOnce((prev) => ({
            ...prev,
            [currentOfficeWeVoteId]: true,
          }));
        }
      } else {
        // console.log('Calling candidatesRetrieve, officeWeVoteId:', currentOfficeWeVoteId);
        CandidateActions.candidatesRetrieve(currentOfficeWeVoteId);
      }
      setCandidateList(currentCandidateList);
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
    AnalyticsActions.saveActionOffice(VoterStore.electionId(), params.office_we_vote_id);

    const candidateStoreListener = CandidateStore.addListener(onCandidateStoreChange);
    const officeStoreListener = OfficeStore.addListener(onOfficeStoreChange);

    return () => {
      candidateStoreListener.remove();
      officeStoreListener.remove();
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
    <PageContentContainer>
      <Helmet
        title={titleText}
        meta={[{ name: 'description', content: descriptionText }]}
      />
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
            // primaryParty={item.primary_party}
            // totalNumberOfBallotItems={totalNumberOfBallotItems}
            useHelpDefeatOrHelpWin
            weVoteId={office.we_vote_id}
            // key={key}
          />
        </Suspense>
      </OfficeWrapper>
    </PageContentContainer>
  );
};
Office.propTypes = {
  // match: PropTypes.object.isRequired,
};

const OfficeWrapper = styled('div')`
  margin: 0 15px;
`;

export default Office;

