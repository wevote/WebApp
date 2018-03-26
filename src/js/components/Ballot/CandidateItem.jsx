import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import CandidateStore from "../../stores/CandidateStore";
import { historyPush } from "../../utils/cordovaUtils";
import ImageHandler from "../ImageHandler";
import ItemSupportOpposeRaccoon from "../Widgets/ItemSupportOpposeRaccoon";
import { renderLog } from "../../utils/logging";
import OfficeNameText from "../Widgets/OfficeNameText";
import ParsedTwitterDescription from "../Twitter/ParsedTwitterDescription";
import SupportStore from "../../stores/SupportStore";
import VoterGuideStore from "../../stores/VoterGuideStore";
import { abbreviateNumber, numberWithCommas } from "../../utils/textFormat";

// This is related to /js/components/VoterGuide/OrganizationVoterGuideCandidateItem.jsx
export default class CandidateItem extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_photo_url_large: PropTypes.string.isRequired,
    candidate_photo_url_medium: PropTypes.string,
    contest_office_name: PropTypes.string,
    showLargeImage: PropTypes.bool,
    commentButtonHide: PropTypes.bool,
    hideOpinionsToFollow: PropTypes.bool,
    hidePositionStatement: PropTypes.bool,
    party: PropTypes.string,
    position_list: PropTypes.array,
    showPositionsInYourNetworkBreakdown: PropTypes.bool,
    showPositionStatementActionBar: PropTypes.bool,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    twitter_handle: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired, // This is the candidate_we_vote_id
    link_to_ballot_item_page: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      candidate_we_vote_id: "",
      hide_position_statement: this.props.hidePositionStatement,
      maximum_organization_display: 5,
      office_we_vote_id: "",
      transitioning: false,
    };
    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    let supportProps = SupportStore.get(this.props.we_vote_id);
    if (supportProps !== undefined) {
      this.setState({
        supportProps: supportProps,
        transitioning: false,
      });
    }

    // console.log("CandidateItem, this.props:", this.props);
    if (this.props.we_vote_id) {
      // If here we want to get the candidate so we can get the office_we_vote_id
      let candidate = CandidateStore.getCandidate(this.props.we_vote_id);
      this.setState({
        candidate_we_vote_id: this.props.we_vote_id,
        office_we_vote_id: candidate.office_we_vote_id,
      });
    }
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onVoterGuideStoreChange (){
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
  }

  onSupportStoreChange () {
    let supportProps = SupportStore.get(this.state.candidate_we_vote_id);
    if (supportProps !== undefined) {
      this.setState({ supportProps: supportProps, transitioning: false });
    }
  }

  togglePositionStatement (){
    this.setState({hide_position_statement: !this.state.hide_position_statement});
  }

  getCandidateLink () {
    // If here, we assume the voter is on the Office page
    return "/candidate/" + this.state.candidate_we_vote_id + "/b/bto/";
  }

  getOfficeLink () {
    return "/office/" + this.state.office_we_vote_id + "/b/btvg/";
  }

  goToCandidateLink () {
    // If here, we assume the voter is on the Office page
    historyPush("/candidate/" + this.state.candidate_we_vote_id + "/b/bto/");
  }

  goToOfficeLink () {
    historyPush("/office/" + this.state.office_we_vote_id + "/b/btvg/");
  }

  render () {
    renderLog(__filename);
    let {
      ballot_item_display_name,
      party,
      we_vote_id,
      twitter_description,
      twitter_followers_count,
      contest_office_name,
      // twitter_handle,
    } = this.props;

    let candidate_we_vote_id = this.props.we_vote_id;

    let candidate_photo_url;
    if (this.props.showLargeImage) {
      if (this.props.candidate_photo_url_large) {
        candidate_photo_url = this.props.candidate_photo_url_large;
      }
    } else if (this.props.candidate_photo_url_medium) {
      candidate_photo_url = this.props.candidate_photo_url_medium;
    }
    let candidate_photo_url_html;
    if (candidate_photo_url) {
      candidate_photo_url_html = <ImageHandler className="card-main__avatar"
                                          sizeClassName="icon-office-child "
                                          imageUrl={candidate_photo_url}
                                          alt="candidate-photo"
                                          kind_of_ballot_item="CANDIDATE" />;
    } else {
      candidate_photo_url_html = <i className="card-main__avatar icon-office-child icon-main icon-icon-person-placeholder-6-1" />;
    }
    // let positions_in_your_network = SupportStore.get(we_vote_id) && ( SupportStore.get(we_vote_id).oppose_count || SupportStore.get(we_vote_id).support_count);

    let one_candidate = CandidateStore.getCandidate(candidate_we_vote_id);
    let candidateSupportStore = SupportStore.get(candidate_we_vote_id);
    let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(candidate_we_vote_id);
    let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(candidate_we_vote_id);

    let positions_display_raccoon = <div>
      <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50">
        {/* Positions in Your Network and Possible Voter Guides to Follow */}
        <ItemSupportOpposeRaccoon ballotItemWeVoteId={candidate_we_vote_id}
                                  ballot_item_display_name={one_candidate.ballot_item_display_name}
                                  goToCandidate={this.goToCandidateLink}
                                  maximumOrganizationDisplay={8}
                                  organizationsToFollowSupport={organizationsToFollowSupport}
                                  organizationsToFollowOppose={organizationsToFollowOppose}
                                  popoverBottom
                                  showPositionStatementActionBar={this.props.showPositionStatementActionBar}
                                  supportProps={candidateSupportStore}
                                  type="CANDIDATE"/>
      </div>
    </div>;

    return <div className="card-main candidate-card">
      <div className="card-main__media-object">
        <div className="card-main__media-object-anchor">
          {this.props.link_to_ballot_item_page ?
            <Link to={this.getCandidateLink} className="u-no-underline">{candidate_photo_url_html}</Link> :
            candidate_photo_url_html
          }

          {twitter_followers_count ?
            <span className={this.props.link_to_ballot_item_page ?
                    "twitter-followers__badge u-cursor--pointer" :
                    "twitter-followers__badge" }
                  onClick={ this.props.link_to_ballot_item_page ? this.goToCandidateLink : null }
            >
              <span className="fa fa-twitter twitter-followers__icon" />
              <span title={numberWithCommas(twitter_followers_count)}>{abbreviateNumber(twitter_followers_count)}</span>
            </span> :
            null
          }
        </div>

        <div className="card-main__media-object-content">
          <h2 className="card-main__display-name">
            { this.props.link_to_ballot_item_page ?
              <Link to={this.getCandidateLink}>{ballot_item_display_name}</Link> :
              ballot_item_display_name
            }
          </h2>
          <BookmarkToggle we_vote_id={we_vote_id} type="CANDIDATE"/>
          <p className={this.props.link_to_ballot_item_page ?
              "u-gray-darker u-cursor--pointer" :
              "u-gray-darker"
            } onClick={this.props.link_to_ballot_item_page ?
              this.goToCandidateLink : null }
          >
          { contest_office_name ?
          <OfficeNameText political_party={party} contest_office_name={contest_office_name} /> :
            null
          }
          </p>
          { twitter_description ?
            <div className={ "u-stack--sm" + (this.props.link_to_ballot_item_page ? " card-main__description-container--truncated" : " card-main__description-container")}>
              <div>
                <ParsedTwitterDescription
                  twitter_description={twitter_description}
                />
              </div>
              <Link to={this.getCandidateLink}>
                { this.props.link_to_ballot_item_page ? <span className="card-main__read-more-pseudo" /> : null }
              </Link>
              { this.props.link_to_ballot_item_page ?
                <Link to={this.getCandidateLink} className="card-main__read-more-link">&nbsp;Read more</Link> :
                null
              }
            </div> :
            null
          }
        </div> {/* END .card-main__media-object-content */}
      </div> {/* END .card-main__media-object */}
      <div className="card-main__actions">
        {positions_display_raccoon}

        {/* this.state.hide_position_statement ?
          null :
          <ItemPositionStatementActionBar ballot_item_we_vote_id={we_vote_id}
                                        ballot_item_display_name={ballot_item_display_name}
                                        supportProps={supportProps}
                                        transitioning={transitioning}
                                        type="CANDIDATE" /> */}
      </div>
    </div>;
  }
}
