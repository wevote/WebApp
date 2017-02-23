import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import GuideStore from "../../stores/GuideStore";
import ImageHandler from "../../components/ImageHandler";
import ItemActionBar from "../../components/Widgets/ItemActionBar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import ItemTinyOpinionsToFollow from "../../components/VoterGuide/ItemTinyOpinionsToFollow";
import StarAction from "../../components/Widgets/StarAction";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";

export default class OfficeItemCompressed extends Component {
  static propTypes = {
    key: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    kind_of_ballot_item: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    candidate_list: PropTypes.array,
    _toggleCandidateModal: PropTypes.func
  };
  constructor (props) {
    super(props);
    this.state = {
      transitioning: false
    };
  }

  componentDidMount () {
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    this._onGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this._onSupportStoreChange.bind(this));
    // console.log("OfficeItemCompressed, this.props.we_vote_id: ", this.props.we_vote_id);
  }

  componentWillUnmount () {
    this.guideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  _onGuideStoreChange (){
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
    // console.log("_onGuideStoreChange");
  }

  _onSupportStoreChange () {
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
    // console.log("_onSupportStoreChange");
  }

  render () {
    let { ballot_item_display_name, we_vote_id } = this.props;
    let officeLink = "/office/" + we_vote_id;

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

        <div className={this.props.link_to_ballot_item_page ?
                "u-cursor--pointer" : null } >
          { this.props.candidate_list.map( (one_candidate) =>
            <div key={one_candidate.we_vote_id} className="u-stack--md">
              <div className="u-flex u-items-center">
                {/* *** Candidate name *** */}
                <div className="u-flex-auto u-inline--sm u-cursor--pointer"
                    onClick={ this.props.link_to_ballot_item_page ?
                              ()=>{browserHistory.push("/candidate/" + one_candidate.we_vote_id);} :
                              null }>
                  <span className="hidden-xs">
                    <ImageHandler className="card-main__avatar"
                                  sizeClassName="icon-candidate-small "
                                  imageUrl={one_candidate.candidate_photo_url}
                                  alt="candidate-photo"
                                  kind_of_ballot_item="CANDIDATE" />
                  </span>
                  <span className="h5">{one_candidate.ballot_item_display_name}</span>
                </div>

                {/* *** "Positions in your Network" bar OR items you can follow *** */}
                <div className="u-flex-none u-justify-end u-inline--sm">
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
                                                    organizationsToFollow={GuideStore.toFollowListForBallotItemById(one_candidate.we_vote_id)}/>
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
              </div>{/* end .row */}
            </div>)
          }
        </div>
      </div>
    </div>;
  }
}
