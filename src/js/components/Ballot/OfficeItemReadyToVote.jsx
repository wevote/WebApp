import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import VoterGuideStore from "../../stores/VoterGuideStore";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";


export default class OfficeItemReadyToVote extends Component {
  static propTypes = {
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

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    // console.log("OfficeItemCompressed, this.props.we_vote_id: ", this.props.we_vote_id);
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onVoterGuideStoreChange (){
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
    // console.log("onVoterGuideStoreChange");
  }

  onSupportStoreChange () {
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
    // console.log("onSupportStoreChange");
  }

  render () {
    let { ballot_item_display_name, we_vote_id } = this.props;
    let officeLink = "/office/" + we_vote_id;
    let goToOfficeLink = function () { historyPush(officeLink); };
    let is_support_array = [];
    let candidate_with_most_support = null;
    let voter_supports_at_least_one_candidate = false;
    let supportProps;
    let is_support;

    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    this.props.candidate_list.forEach((candidate) => {
      supportProps = SupportStore.get(candidate.we_vote_id);
      if (supportProps) {
        is_support = supportProps.is_support;

        if (is_support) {
          is_support_array.push(candidate.ballot_item_display_name);
          voter_supports_at_least_one_candidate = true;
        }
      }
    });

    /* This function finds the highest support count for each office but does not handle ties. If two candidates have the
    same network support count, only the first candidate will be displayed. */
    let largest_support_count = 0;
    let at_least_one_candidate_chosen = false;

    if (is_support_array.length === 0){
      let network_support_count;
      let network_oppose_count;

      this.props.candidate_list.forEach((candidate) => {
        supportProps = SupportStore.get(candidate.we_vote_id);
        if (supportProps) {
          network_support_count = supportProps.support_count;
          network_oppose_count = supportProps.oppose_count;

          if (network_support_count > network_oppose_count) {
            if (network_support_count > largest_support_count) {
              largest_support_count = network_support_count;
              candidate_with_most_support = candidate.ballot_item_display_name;
              at_least_one_candidate_chosen = true;
            }
          }
        }
      });
    }

    return <div className="card-main office-item">
      <div className="card-main__content">
        <h2 className="card-main__display-name">
          { this.props.link_to_ballot_item_page ?
            <Link to={officeLink}>{ballot_item_display_name}</Link> :
              ballot_item_display_name
          }
        </h2>

      <div className={ this.props.link_to_ballot_item_page ?
                "u-cursor--pointer" : null } >
          { this.props.candidate_list.map( (one_candidate) =>
            <div key={one_candidate.we_vote_id}>
              {/* *** Candidate name *** */}
              { SupportStore.get(one_candidate.we_vote_id) && SupportStore.get(one_candidate.we_vote_id).is_support ?
                <div className="u-flex u-items-center">
                  <div className="u-flex-auto u-cursor--pointer" onClick={ this.props.link_to_ballot_item_page ?
                  goToOfficeLink : null }>
                    <h2 className="h5">
                    {one_candidate.ballot_item_display_name}
                    </h2>
                  </div>

                  <div className="u-flex-none u-justify-end">
                    <span className="u-push--xs">Supported by you</span>
                    <img src={cordovaDot("/img/global/svg-icons/thumbs-up-color-icon.svg")} width="24" height="24" />
                  </div>
                </div> :

                  candidate_with_most_support === one_candidate.ballot_item_display_name ?

                <div className="u-flex u-items-center">
                  <div className="u-flex-auto u-cursor--pointer" onClick={ this.props.link_to_ballot_item_page ?
                    goToOfficeLink : null }>
                    <h2 className="h5">
                      {one_candidate.ballot_item_display_name}
                    </h2>
                  </div>
                  <div className="u-flex-none u-justify-end">
                    <span className="u-push--xs">Your network supports</span>
                    <img src={cordovaDot("/img/global/icons/up-arrow-color-icon.svg")} className="network-positions__support-icon" width="20" height="20" />
                  </div>
                </div> :
                  is_support_array === 0 && candidate_with_most_support !== one_candidate.ballot_item_display_name && !voter_supports_at_least_one_candidate ?
                  <div className="u-flex-none u-justify-end">Your network is undecided</div> :
                    null}
              {/* *** "Positions in your Network" bar OR items you can follow *** */}
          </div>)
          }
          { voter_supports_at_least_one_candidate ?
            null :
            <span>
              { at_least_one_candidate_chosen ?
                null :
                <div className="u-tr">Your network is undecided</div> }
            </span> }
        </div>
      </div>
    </div>;
  }
}
