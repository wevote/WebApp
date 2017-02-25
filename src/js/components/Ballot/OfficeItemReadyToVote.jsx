import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import GuideStore from "../../stores/GuideStore";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";


export default class OfficeItemReadyToVote extends Component {
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
    let goToOfficeLink = function () { browserHistory.push(officeLink); };
    let is_support_array = [];
    let candidate_with_most_support = null;
    let supportProps;
    let is_support;

    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    this.props.candidate_list.forEach((candidate) => {
      supportProps = SupportStore.get(candidate.we_vote_id);
      if (supportProps) {
        is_support = supportProps.is_support;

        if (is_support) {
          is_support_array.push(candidate.ballot_item_display_name);
        }
      }
    });

    /* This function finds the highest support count for each office but does not handle ties. If two candidates have the
    same network support count, only the first candidate will be displayed. */
    let largest_support_count;
    let at_least_one_candidate_chosen = false;
    let voter_supports_at_least_one_candidate;

    if (is_support_array.length === 0){
      let network_support_count;
      let network_oppose_count;

      this.props.candidate_list.forEach((candidate) => {
        largest_support_count = 0;
        supportProps = SupportStore.get(candidate.we_vote_id);
        if (supportProps) {
          if (!voter_supports_at_least_one_candidate) {
            voter_supports_at_least_one_candidate = supportProps.is_support;
          }
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

        <table className={ this.props.link_to_ballot_item_page ?
                "u-cursor--pointer table table-condensed" : "table table-condensed" } >
          <tbody>
          { this.props.candidate_list.map( (one_candidate) =>
            <tr key={one_candidate.we_vote_id}>
              {/* *** Candidate name *** */}

              { SupportStore.get(one_candidate.we_vote_id) && SupportStore.get(one_candidate.we_vote_id).is_support ?
                <td className="col-md-12" onClick={ this.props.link_to_ballot_item_page ?
                  goToOfficeLink : null }>
                  {one_candidate.ballot_item_display_name}<span className="pull-right">Supported by you &nbsp; <img src="/img/global/svg-icons/thumbs-up-color-icon.svg"
               className="card-main__position-icon" width="24" height="24" /></span>
                </td> :
                  candidate_with_most_support === one_candidate.ballot_item_display_name ?
                <td className="col-md-12" onClick={ this.props.link_to_ballot_item_page ?
                  goToOfficeLink : null }>
                  {one_candidate.ballot_item_display_name}<span className="pull-right">Your network supports &nbsp; <img src="/img/global/icons/up-arrow-color-icon.svg" className="network-positions__support-icon" width="20" height="20" /></span>
                </td> :
                  is_support_array === 0 && candidate_with_most_support !== one_candidate.ballot_item_display_name ?
                <td><span className="pull-right">Your network is undecided</span></td> :
                  null}

              {/* *** "Positions in your Network" bar OR items you can follow *** */}

            </tr>)
          }
          { !at_least_one_candidate_chosen && !voter_supports_at_least_one_candidate ?
            <tr><td>
              <span className="pull-right">Your network is undecided</span>
            </td></tr> :
            null }
          </tbody>
        </table>
      </div>
    </div>;
  }
}
