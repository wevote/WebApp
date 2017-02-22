import React, { Component, PropTypes } from "react";
import CandidateActions from "../../actions/CandidateActions";
import CandidateItem from "../../components/Ballot/CandidateItem";
import CandidateStore from "../../stores/CandidateStore";
import { capitalizeString } from "../../utils/textFormat";
import GuideActions from "../../actions/GuideActions";
import GuideList from "../../components/VoterGuide/GuideList";
import GuideStore from "../../stores/GuideStore";
import Helmet from "react-helmet";
import LoadingWheel from "../../components/LoadingWheel";
import PositionList from "../../components/Ballot/PositionList";
import SupportActions from "../../actions/SupportActions";
import ThisIsMeAction from "../../components/Widgets/ThisIsMeAction";
import VoterStore from "../../stores/VoterStore";
import SearchAllActions from "../../actions/SearchAllActions";
const web_app_config = require("../../config");

export default class Candidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      candidate: {},
      candidate_we_vote_id: this.props.params.candidate_we_vote_id,
      // Eventually we could use this toFollowListForBallotItemById with candidate_we_vote_id, but we can't now
      //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
      // guidesToFollowList: GuideStore.toFollowListForBallotItemById(this.props.params.candidate_we_vote_id)
      guidesToFollowList: GuideStore.toFollowListForBallotItem()
    };
  }

  componentDidMount (){
    this.candidateStoreListener = CandidateStore.addListener(this._onCandidateStoreChange.bind(this));
    var { candidate_we_vote_id } = this.state;
    CandidateActions.retrieve(candidate_we_vote_id);

    // Get the latest guides to follow for this candidate
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    GuideActions.retrieveGuidesToFollowByBallotItem(candidate_we_vote_id, "CANDIDATE");

    // Make sure supportProps exist for this Candidate when browser comes straight to candidate page
    SupportActions.retrievePositionsCountsForOneBallotItem(candidate_we_vote_id);

    // Display the candidate's name in the search box
    var searchBoxText = this.state.candidate.ballot_item_display_name || "";  // TODO DALE Not working right now
    SearchAllActions.exitSearch(searchBoxText); // TODO: still not used :)
  }

  componentWillReceiveProps (nextProps) {
    // When a new candidate is passed in, update this component to show the new data
    this.setState({candidate_we_vote_id: nextProps.params.candidate_we_vote_id});

    CandidateActions.retrieve(nextProps.params.candidate_we_vote_id);

    GuideActions.retrieveGuidesToFollowByBallotItem(nextProps.params.candidate_we_vote_id, "CANDIDATE");

    // Display the candidate's name in the search box
    // var { candidate } = this.state;
    // var searchBoxText = candidate.ballot_item_display_name || "";  // TODO DALE Not working right now
    SearchAllActions.exitSearch("");
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.guideStoreListener.remove();
  }

  _onCandidateStoreChange (){
    let { candidate_we_vote_id } = this.state;
    let candidate = CandidateStore.get(candidate_we_vote_id) || {};
    this.setState({ candidate: candidate });
  }

  _onGuideStoreChange (){
    let { candidate_we_vote_id } = this.state;
    // Eventually we could use this toFollowListForBallotItemById with candidate_we_vote_id, but we can't now
    //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
    // this.setState({ guidesToFollowList: GuideStore.toFollowListForBallotItemById(this.state.candidate_we_vote_id) });
    this.setState({ guidesToFollowList: GuideStore.toFollowListForBallotItem() });
    // When the guidesToFollowList changes, trigger an update of the candidate so we can get an updated position_list
    CandidateActions.retrieve(this.state.candidate_we_vote_id);
    // Also update the position count for *just* this candidate, since it might not come back with positionsCountForAllBallotItems
    SupportActions.retrievePositionsCountsForOneBallotItem(candidate_we_vote_id);
  }

  render () {
    const electionId = VoterStore.election_id();
    const NO_VOTER_GUIDES_TEXT = "We could not find any more voter guides to follow about this candidate or measure.";
    var { candidate, guidesToFollowList, candidate_we_vote_id } = this.state;

    if (!candidate || !candidate.ballot_item_display_name){
      // TODO DALE If the candidate we_vote_id is not valid, we need to update this with a notice
      return <div className="container-fluid well u-stack--md u-inset--md">
                <div>{LoadingWheel}</div>
                <br />
            </div>;
    }
    let candidate_name = capitalizeString(candidate.ballot_item_display_name);
    let title_text = candidate_name + " - We Vote";
    let description_text = "Information about " + candidate_name + ", candidate for " + candidate.contest_office_name;
    let voter = VoterStore.getVoter();
    let candidate_admin_edit_url = web_app_config.WE_VOTE_SERVER_ROOT_URL + "c/" + this.state.candidate.id + "/edit/?google_civic_election_id=" + VoterStore.election_id() + "&state_code=";

    return <span>
      <Helmet title={title_text}
              meta={[{"name": "description", "content": description_text}]}
              />
        <section className="card">
          <CandidateItem {...candidate}
                         commentButtonHide
                         contest_office_name={candidate.contest_office_name}
                         hideOpinionsToFollow
                         showPositionsInYourNetworkBreakdown />
          <div className="card__additional">
            { candidate.position_list ?
              <div>
                <PositionList position_list={candidate.position_list}
                              hideSimpleSupportOrOppose
                              ballot_item_display_name={candidate.ballot_item_display_name} />
              </div> :
              null
            }
            {guidesToFollowList.length === 0 ?
              <p className="card__no-additional">{NO_VOTER_GUIDES_TEXT}</p> :
              <div><h3 className="card__additional-heading">{"More opinions about " + candidate.ballot_item_display_name}</h3>
              <GuideList id={electionId} ballotItemWeVoteId={candidate_we_vote_id} organizationsToFollow={guidesToFollowList}/></div>
            }
          </div>
        </section>
        <br />
        <ThisIsMeAction twitter_handle_being_viewed={candidate.twitter_handle}
                      name_being_viewed={candidate.ballot_item_display_name}
                      kind_of_owner="POLITICIAN" />
        <br />
      {/* Show links to this candidate in the admin tools */}
      { voter.is_admin ?
        <span>Admin: <a href={candidate_admin_edit_url} target="_blank">edit {candidate_name}</a></span> :
        null
      }
      </span>;

  }
}
