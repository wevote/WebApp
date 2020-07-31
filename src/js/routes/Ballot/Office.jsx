import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import CandidateList from '../../components/Ballot/CandidateList';
import { capitalizeString } from '../../utils/textFormat';
import AnalyticsActions from '../../actions/AnalyticsActions';
import AppActions from '../../actions/AppActions';
import BallotStore from '../../stores/BallotStore';
import CandidateActions from '../../actions/CandidateActions';
import CandidateStore from '../../stores/CandidateStore';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import OfficeActions from '../../actions/OfficeActions';
import OfficeStore from '../../stores/OfficeStore';
import { sortCandidateList } from '../../utils/positionFunctions';
import Testimonial from '../../components/Widgets/Testimonial';
import VoterStore from '../../stores/VoterStore';
import { cordovaDot } from '../../utils/cordovaUtils';
import daleMcGrewJpm from '../../../img/global/photos/Dale_McGrew-200x200.jpg';


// This is related to routes/VoterGuide/OrganizationVoterGuideOffice
class Office extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

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
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.officeStoreListener = OfficeStore.addListener(this.onOfficeStoreChange.bind(this));
    const officeWeVoteId = this.props.params.office_we_vote_id;
    const office = OfficeStore.getOffice(officeWeVoteId);
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
      }
      this.setState({
        candidateList,
        office,
      });
    } else {
      OfficeActions.officeRetrieve(officeWeVoteId);
      CandidateActions.candidatesRetrieve(officeWeVoteId);
      // console.log('componentDidMount officeRetrieve');
    }

    this.setState({
      officeWeVoteId,
    });

    if (!IssueStore.issueDescriptionsRetrieveCalled()) {
      IssueActions.issueDescriptionsRetrieve();
      // IssueActions.issueDescriptionsRetrieveCalled(); // TODO: Move this to AppActions? Currently throws error: "Cannot dispatch in the middle of a dispatch"
    }
    IssueActions.issuesFollowedRetrieve();
    if (VoterStore.electionId() && !IssueStore.issuesUnderBallotItemsRetrieveCalled(VoterStore.electionId())) {
      IssueActions.issuesUnderBallotItemsRetrieve(VoterStore.electionId());
    }
    const modalToOpen = this.props.params.modal_to_show || '';
    if (modalToOpen === 'share') {
      AppActions.setShowShareModal(true);
    } else if (modalToOpen === 'sic') { // sic = Shared Item Code
      const sharedItemCode = this.props.params.shared_item_code || '';
      if (sharedItemCode) {
        AppActions.setShowSharedItemModal(sharedItemCode);
      }
    }
    ActivityActions.activityNoticeListRetrieve();
    AnalyticsActions.saveActionOffice(VoterStore.electionId(), this.props.params.office_we_vote_id);
  }

  componentWillReceiveProps (nextProps) {
    const modalToOpen = nextProps.params.modal_to_show || '';
    if (modalToOpen === 'share') {
      AppActions.setShowShareModal(true);
    } else if (modalToOpen === 'sic') { // sic = Shared Item Code
      const sharedItemCode = nextProps.params.shared_item_code || '';
      if (sharedItemCode) {
        AppActions.setShowSharedItemModal(sharedItemCode);
      }
    }
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.officeStoreListener.remove();
  }

  onCandidateStoreChange () {
    let { candidateList } = this.state;
    const { officeWeVoteId } = this.state;
    let newCandidate;
    const newCandidateList = [];
    if (candidateList && candidateList.length && officeWeVoteId) {
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
    }
  }

  onOfficeStoreChange () {
    const { officeWeVoteId } = this.state;
    const office = OfficeStore.getOffice(officeWeVoteId);
    // console.log('Office.jsx onOfficeStoreChange:', officeWeVoteId, ', office:', office);
    let newCandidate;
    const newCandidateList = [];
    if (office && office.ballot_item_display_name) {
      let { candidate_list: candidateList } = office;
      if (candidateList && candidateList.length && officeWeVoteId) {
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
        candidateList,
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
    // console.log('Office.jsx office:', office);

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
      <OfficeWrapper>
        <Helmet
          title={titleText}
          meta={[{ name: 'description', content: descriptionText }]}
        />
        <div className="col-sm-12 col-lg-9">
          { candidateList && candidateList.length ? (
            <div>
              <CandidateList
                contest_office_name={office.ballot_item_display_name}
              >
                {candidateList}
              </CandidateList>
            </div>
          ) :
            <span>Loading candidates...</span>
        }
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
      </OfficeWrapper>
    );
  }
}


const OfficeWrapper = styled.div`
  display: flex;
`;

export default Office;

