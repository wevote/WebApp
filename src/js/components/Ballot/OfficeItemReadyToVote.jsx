import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import GuideStore from "../../stores/GuideStore";
//import ItemActionBar from "../../components/Widgets/ItemActionBar";
//import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
//import ItemTinyOpinionsToFollow from "../../components/VoterGuide/ItemTinyOpinionsToFollow";
//import StarAction from "../../components/Widgets/StarAction";
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
    let isSupport = [];
    let networkSupport = null;

    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    this.props.candidate_list.forEach((candidate) => {
      SupportStore.get(candidate.we_vote_id) && SupportStore.get(candidate.we_vote_id).is_support ?
          isSupport.push(candidate.ballot_item_display_name) :
          null;
      });

    this.props.candidate_list.forEach((candidate) => {
      isSupport.length === 0 && SupportStore.get(candidate.we_vote_id) && SupportStore.get(candidate.we_vote_id).support_count > SupportStore.get(candidate.we_vote_id).oppose_count ? networkSupport = candidate.ballot_item_display_name :
        null;
      });

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
                  {one_candidate.ballot_item_display_name}<span className="vote-ready-support">Supported by you</span>
                </td> :
                  networkSupport === one_candidate.ballot_item_display_name ?
                <td className="col-md-12" onClick={ this.props.link_to_ballot_item_page ?
                  goToOfficeLink : null }>
                  {one_candidate.ballot_item_display_name}<span className="vote-ready-support">Your network supports</span>
                </td> :
                  isSupport === 0 && networkSupport !== one_candidate.ballot_item_display_name ?
                <td><span className="vote-ready-support">Your network is undecided</span></td> :
                  null}
              {/* *** "Positions in your Network" bar OR items you can follow *** */}

            </tr>)
          }
          </tbody>
        </table>
      </div>
    </div>;
  }
}
