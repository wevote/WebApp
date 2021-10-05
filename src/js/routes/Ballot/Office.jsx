import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import ActivityActions from '../../actions/ActivityActions';
import AnalyticsActions from '../../actions/AnalyticsActions';
import CandidateActions from '../../actions/CandidateActions';
import IssueActions from '../../actions/IssueActions';
import OfficeActions from '../../actions/OfficeActions';
import CandidateList from '../../components/Ballot/CandidateList';
import LoadingWheel from '../../components/LoadingWheel';
import { PageContentContainer } from '../../utils/pageLayoutStyles';
import Testimonial from '../../components/Widgets/Testimonial';
import AppObservableStore from '../../stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import OfficeStore from '../../stores/OfficeStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { sortCandidateList } from '../../utils/positionFunctions';
import { capitalizeString } from '../../utils/textFormat';

const daleMcGrewJpm = '../../../img/global/photos/Dale_McGrew-200x200.jpg';


// This is related to routes/VoterGuide/OrganizationVoterGuideOffice
class Office extends Component {
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

    IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
    IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
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
    ActivityActions.activityNoticeListRetrieve();
    AnalyticsActions.saveActionOffice(VoterStore.electionId(), params.office_we_vote_id);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('Office componentWillReceiveProps');
    const { match: { params: nextParams } } = nextProps;
    const modalToOpen = nextParams.modal_to_show || '';
    if (modalToOpen === 'share') {
      this.modalOpenTimer = setTimeout(() => {
        AppObservableStore.setShowShareModal(true);
      }, 1000);
    } else if (modalToOpen === 'sic') { // sic = Shared Item Code
      const sharedItemCode = nextParams.shared_item_code || '';
      if (sharedItemCode) {
        this.modalOpenTimer = setTimeout(() => {
          AppObservableStore.setShowSharedItemModal(sharedItemCode);
        }, 1000);
      }
    }
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
    // console.log('Office.jsx onOfficeStoreChange:', officeWeVoteId, ', office:', office);
    let newCandidate;
    const newCandidateList = [];
    if (office && office.ballot_item_display_name) {
      let { candidate_list: candidateList } = office;
      if (candidateList && candidateList.length > 0 && officeWeVoteId) {
        // console.log('In Office candidateList loop');
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

  render () {
    renderLog('Office');  // Set LOG_RENDER_EVENTS to log all renders
    const { candidateList, office } = this.state;
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

    const officeName = capitalizeString(office.ballot_item_display_name);
    const titleText = `${officeName} - We Vote`;
    const descriptionText = `Choose who you support for ${officeName} in this election`;

    // =========== Testimonial variables ============================

    const testimonialAuthor = 'Dale M., Oakland, California';
    const imageUrl = cordovaDot(daleMcGrewJpm);
    const testimonial = 'I like seeing the opinions of people who share my values.';

    // ==============================================================


    return (
      <PageContentContainer>
        <Helmet
          title={titleText}
          meta={[{ name: 'description', content: descriptionText }]}
        />
        <div className="col-sm-12 col-lg-9">
          { candidateList && candidateList.length ? (
            <div>
              <CandidateList
                contest_office_name={office.ballot_item_display_name}
                forMoreInformationTextOff
              >
                {candidateList}
              </CandidateList>
            </div>
          ) :
            <span>Loading candidates...</span>}
        </div>
        <div className="col-lg-3 d-none d-lg-block">
          <div className="card">
            <div className="card-main">
              <Testimonial
                imageUrl={imageUrl}
                testimonialAuthor={testimonialAuthor}
                testimonial={testimonial}
              />
            </div>
          </div>

        </div>
      </PageContentContainer>
    );
  }
}
Office.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Office;

