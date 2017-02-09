import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import GuideStore from "../../stores/GuideStore";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import StarAction from "../../components/Widgets/StarAction";
import SupportStore from "../../stores/SupportStore";
import ItemTinyOpinionsToFollow from "../../components/VoterGuide/ItemTinyOpinionsToFollow";
import { capitalizeString } from "../../utils/textFormat";

export default class OfficeItemCompressed extends Component {
  static propTypes = {
    key: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    kind_of_ballot_item: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    candidate_list: PropTypes.array
  };
  constructor (props) {
    super(props);
    this.state = {
      transitioning: false
    };
  }

  // _onGuideStoreChange (){
  //   let { candidate_we_vote_id } = this.state;
  //   // Eventually we could use this toFollowListForBallotItemById with candidate_we_vote_id, but we can't now
  //   //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
  //   // this.setState({ guidesToFollowList: GuideStore.toFollowListForBallotItemById(this.state.candidate_we_vote_id) });
  //   this.setState({ guidesToFollowList: GuideStore.toFollowListForBallotItem() });
  //   // When the guidesToFollowList changes, trigger an update of the candidate so we can get an updated position_list
  //   CandidateActions.retrieve(this.state.candidate_we_vote_id);
  //   // Also update the position count for *just* this candidate, since it might not come back with positionsCountForAllBallotItems
  //   SupportActions.retrievePositionsCountsForOneBallotItem(candidate_we_vote_id);
  // }

  render () {
    let { ballot_item_display_name, we_vote_id } = this.props;
    let officeLink = "/office/" + we_vote_id;
    let goToOfficeLink = function () { browserHistory.push(officeLink); };

    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    return <div className="card-main office-item">
      <div className="card-main__content">
        <h2 className="card-main__display-name">
          { this.props.link_to_ballot_item_page ?
            <Link to={officeLink}>{ballot_item_display_name}</Link> :
              ballot_item_display_name
          }
        </h2>
        <StarAction we_vote_id={we_vote_id} type="OFFICE"/>

        <div className={ this.props.link_to_ballot_item_page ?
                "u-cursor--pointer" : null }
              onClick={ this.props.link_to_ballot_item_page ?
                goToOfficeLink : null }>
          { this.props.candidate_list.map( (one_candidate) =>
            <span key={one_candidate.we_vote_id}>
              <span>{one_candidate.ballot_item_display_name}
                {/* Decide whether to show the "Positions in your network" bar or the options of groups to follow */}
                { SupportStore.get(one_candidate.we_vote_id) && ( SupportStore.get(one_candidate.we_vote_id).oppose_count || SupportStore.get(one_candidate.we_vote_id).support_count) ?
                  <ItemSupportOpposeCounts we_vote_id={one_candidate.we_vote_id}
                                           supportProps={SupportStore.get(one_candidate.we_vote_id)}
                                           type="CANDIDATE"/> :
                  <span>
                  { GuideStore.toFollowListForBallotItemById(one_candidate.we_vote_id) && GuideStore.toFollowListForBallotItemById(one_candidate.we_vote_id).length !== 0 ?
                    <ItemTinyOpinionsToFollow id="5000" ballotItemWeVoteId={one_candidate.we_vote_id}
                               organizationsToFollow={GuideStore.toFollowListForBallotItemById(one_candidate.we_vote_id)}/> :
                    <span /> }
                  </span>
                }

              </span><br />
            </span>)
          }
        </div>
      </div>
    </div>;
  }
}
