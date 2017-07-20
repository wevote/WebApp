import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import GuideStore from "../../stores/GuideStore";
import ImageHandler from "../../components/ImageHandler";
import ItemActionBar from "../../components/Widgets/ItemActionBar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import ItemTinyOpinionsToFollow from "../../components/VoterGuide/ItemTinyOpinionsToFollow";
import BookmarkAction from "../../components/Widgets/BookmarkAction";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";

const NUMBER_OF_CANDIDATES_TO_DISPLAY = 3;

export default class OfficeItemCompressed extends Component {
  static propTypes = {
    key: PropTypes.string,
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
          <BookmarkAction we_vote_id={we_vote_id} type="OFFICE" />
        </div>
          <div className={this.props.link_to_ballot_item_page ?
                "u-cursor--pointer" : null } >
          { candidate_list_to_display.map( (one_candidate) =>
            <div key={one_candidate.we_vote_id} className="u-stack--md">
              <div className="u-flex u-items-center u-flex-wrap u-justify-between">
                {/* *** Candidate name *** */}
                <div className="u-flex u-cursor--pointer u-min-50"
                    onClick={ this.props.link_to_ballot_item_page ?
                              ()=>{browserHistory.push("/candidate/" + one_candidate.we_vote_id);} :
                              null }>
                  <div className="u-push--sm u-stack--sm">
                    <div className="o-media-object--center">
                      <ImageHandler className="card-main__avatar-compressed o-media-object__anchor u-self-start u-push--sm"
                                    sizeClassName="icon-candidate-small u-push--sm "
                                    imageUrl={one_candidate.candidate_photo_url_large}
                                    alt="candidate-photo"
                                    kind_of_ballot_item="CANDIDATE" />
                      <div className="o-media-object__body">
                        <h4 className="card-main__candidate-name u-f4"><a>{one_candidate.ballot_item_display_name}
                          <span className="card-main__candidate-read-more-link hidden-xs">learn&nbsp;more</span></a></h4>

                      </div>
                    </div>
                  </div>
                </div>

                {/* *** "Positions in your Network" bar OR items you can follow *** */}
                <div className="u-flex u-flex-auto u-justify-end u-items-center u-min-50">
                  <div className="u-flex-none u-justify-end u-push--sm">
                    {/* Decide whether to show the "Positions in your network" bar or the options of voter guides to follow */}
                    { SupportStore.get(one_candidate.we_vote_id) && ( SupportStore.get(one_candidate.we_vote_id).oppose_count || SupportStore.get(one_candidate.we_vote_id).support_count) ?
                      <span className="u-cursor--pointer"
                            onClick={ this.props.link_to_ballot_item_page ?
                            ()=>{this.props._toggleCandidateModal(one_candidate);} :
                            null } >
                        <ItemSupportOpposeCounts we_vote_id={one_candidate.we_vote_id}
                                                 supportProps={SupportStore.get(one_candidate.we_vote_id)}
                                                 type="CANDIDATE"/>
                      </span> :
                      <span>
                        {/* Show possible voter guides to follow */}
                        { GuideStore.toFollowListForBallotItemById(one_candidate.we_vote_id) && GuideStore.toFollowListForBallotItemById(one_candidate.we_vote_id).length !== 0 ?
                          <span className="u-cursor--pointer"
                                onClick={ this.props.link_to_ballot_item_page ?
                                ()=>{this.props._toggleCandidateModal(one_candidate);} :
                                null } >
                            <ItemTinyOpinionsToFollow ballotItemWeVoteId={one_candidate.we_vote_id}
                                                      organizationsToFollow={GuideStore.toFollowListForBallotItemById(one_candidate.we_vote_id)}
                                                      maximumOrganizationDisplay={this.state.maximum_organization_display}/>
                          </span> :
                          <span /> }
                      </span>
                    }
                  </div>

                  {/* *** Choose Support or Oppose *** */}
                  <div className="u-flex-none u-cursor--pointer">
                    <ItemActionBar ballot_item_we_vote_id={one_candidate.we_vote_id}
                                   supportProps={SupportStore.get(one_candidate.we_vote_id)}
                                   shareButtonHide
                                   commentButtonHide
                                   transitioniing={this.state.transitioning}
                                   type="CANDIDATE" />
                  </div>
                </div>
              </div>
            </div>)
          }
          </div>

          { !this.state.display_all_candidates_flag && remaining_candidates_to_display_count > 0 ?
            <Link onClick={this.toggleDisplayAllCandidates}>
              <span className="u-items-center">
                Click&nbsp;to&nbsp;see&nbsp;{remaining_candidates_to_display_count}&nbsp;more&nbsp;additional&nbsp;{ballot_item_display_name}s</span>
            </Link> : null
          }
          { this.state.display_all_candidates_flag && this.props.candidate_list.length > NUMBER_OF_CANDIDATES_TO_DISPLAY ?
            <Link onClick={this.toggleDisplayAllCandidates}>
              <span className="u-items-center">view&nbsp;less...</span>
            </Link> : null
          }
      </div>
    </div>;
  }
}
