import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import GuideStore from "../../stores/GuideStore";
import ImageHandler from "../ImageHandler";
import ItemActionBar from "../Widgets/ItemActionBar";
import ItemSupportOpposeCounts from "../Widgets/ItemSupportOpposeCounts";
import ItemTinyOpinionsToFollow from "../VoterGuide/ItemTinyOpinionsToFollow";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import BallotSideBarLink from "../Navigation/BallotSideBarLink";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";

const NUMBER_OF_CANDIDATES_TO_DISPLAY = 3;

export default class OfficeItemCompressed extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    kind_of_ballot_item: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    candidate_list: PropTypes.array,
    _toggleCandidateModal: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      transitioning: false,
      maximum_organization_display: 4,
      display_all_candidates_flag: false,
    };

    this.toggleDisplayAllCandidates = this.toggleDisplayAllCandidates.bind(this);
  }

  componentDidMount () {
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    this._onGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this._onSupportStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.guideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  _onGuideStoreChange (){
    this.setState({ transitioning: false });
  }

  _onSupportStoreChange () {
    this.setState({ transitioning: false });
  }

  toggleDisplayAllCandidates () {
    this.setState({ display_all_candidates_flag: !this.state.display_all_candidates_flag });
  }

  render () {
    let { ballot_item_display_name, we_vote_id } = this.props;
    let officeLink = "/office/" + we_vote_id;

    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    var candidate_list_to_display = this.props.candidate_list;
    var remaining_candidates_to_display_count = 0;

    if (!this.state.display_all_candidates_flag && this.props.candidate_list.length > NUMBER_OF_CANDIDATES_TO_DISPLAY) {
      candidate_list_to_display = this.props.candidate_list.slice(0, NUMBER_OF_CANDIDATES_TO_DISPLAY);
      remaining_candidates_to_display_count = this.props.candidate_list.length - NUMBER_OF_CANDIDATES_TO_DISPLAY;
    }

    return <div className="card-main office-item">
      <a name={we_vote_id} />
      <div className="card-main__content">
        <div className="u-flex u-stack--sm">
          <h2 className="u-f3">
            { this.props.link_to_ballot_item_page ?
              <Link to={officeLink}>
                {ballot_item_display_name}
                <span className="card-main__office-read-more-link hidden-xs">learn&nbsp;more</span>
              </Link> :
              ballot_item_display_name
            }
          </h2>
          <BookmarkToggle we_vote_id={we_vote_id} type="OFFICE" />
        </div>
        { candidate_list_to_display.map( (one_candidate) =>
          <div key={one_candidate.we_vote_id} className="u-stack--md">
            <div className="o-media-object--center u-flex-auto u-min-50 u-push--sm u-stack--sm">
              {/* Candidate Image */}
              <div onClick={ this.props.link_to_ballot_item_page ?
                            ()=>{browserHistory.push("/candidate/" + one_candidate.we_vote_id);} :
                            null }>
                <ImageHandler className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm"
                              sizeClassName="icon-candidate-small u-push--sm "
                              imageUrl={one_candidate.candidate_photo_url_large}
                              alt="candidate-photo"
                              kind_of_ballot_item="CANDIDATE" />
              </div>
              <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
                {/* Candidate Name */}
                <h4 className="card-main__candidate-name u-f4">
                  {one_candidate.ballot_item_display_name}
                  <a onClick={ this.props.link_to_ballot_item_page ?
                                ()=>{browserHistory.push("/candidate/" + one_candidate.we_vote_id);} :
                                null }>
                  <span className="card-main__candidate-read-more-link hidden-xs">learn&nbsp;more</span></a>
                </h4>
                {/* Opinion Items */}
                <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50">
                  {/* Positions in Your Network */}
                  <div className="u-cursor--pointer"
                        onClick={ this.props.link_to_ballot_item_page ?
                        ()=>{this.props._toggleCandidateModal(one_candidate);} :
                        null } >
                    <ItemSupportOpposeCounts we_vote_id={one_candidate.we_vote_id}
                                             supportProps={SupportStore.get(one_candidate.we_vote_id)}
                                             type="CANDIDATE"/>
                  </div>

                  {/* Possible Voter Guides to Follow (Desktop) */}
                  <div className="hidden-xs hidden-print">
                    { GuideStore.getVoterGuidesToFollowForBallotItemId(one_candidate.we_vote_id) && GuideStore.getVoterGuidesToFollowForBallotItemId(one_candidate.we_vote_id).length !== 0 ?
                      <div className="u-cursor--pointer"
                            onClick={ this.props.link_to_ballot_item_page ?
                            ()=>{this.props._toggleCandidateModal(one_candidate);} :
                            null } >
                        <ItemTinyOpinionsToFollow ballotItemWeVoteId={one_candidate.we_vote_id}
                                                  organizationsToFollow={GuideStore.getVoterGuidesToFollowForBallotItemId(one_candidate.we_vote_id)}
                                                  maximumOrganizationDisplay={this.state.maximum_organization_display}/>
                      </div> :
                      null }
                  </div>

                  {/* Support or Oppose */}
                  <div className="u-cursor--pointer">
                    <ItemActionBar ballot_item_we_vote_id={one_candidate.we_vote_id}
                                   supportProps={SupportStore.get(one_candidate.we_vote_id)}
                                   shareButtonHide
                                   commentButtonHide
                                   transitioniing={this.state.transitioning}
                                   type="CANDIDATE" />
                  </div>
                </div>
              </div>
            </div>
          </div>)
        }

        { !this.state.display_all_candidates_flag && remaining_candidates_to_display_count > 0 ?
          <Link onClick={this.toggleDisplayAllCandidates}>
            <span className="u-items-center">
              Click&nbsp;to&nbsp;show&nbsp;{remaining_candidates_to_display_count}&nbsp;more&nbsp;candidates...</span>
          </Link> : null
        }
        { this.state.display_all_candidates_flag && this.props.candidate_list.length > NUMBER_OF_CANDIDATES_TO_DISPLAY ?
          <BallotSideBarLink url={"#" + this.props.we_vote_id}
                             label={"Click to show fewer candidates..."}
                             displaySubtitles={false}
                             onClick={this.toggleDisplayAllCandidates} /> : null
        }
      </div>
    </div>;
  }
}
