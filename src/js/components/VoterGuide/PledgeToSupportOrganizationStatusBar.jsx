import React, { Component } from "react";
import PropTypes from "prop-types";
import { ProgressBar } from "react-bootstrap";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import { renderLog } from "../../utils/logging";

export default class PledgeToSupportOrganizationStatusBar extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      organization: {},
      voter_guide: {},
    };
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.setState({
      organization: this.props.organization,
      voter_guide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(this.props.organization.organization_we_vote_id, VoterStore.election_id()),
    });
  }

  componentWillReceiveProps (nextProps) {
    // When a new organization is passed in, update this component to show the new data
    this.setState({
      organization: nextProps.organization,
      voter_guide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(nextProps.organization.organization_we_vote_id, VoterStore.election_id()),
    });
  }

  componentWillUnmount (){
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange (){
    this.setState({
      voter_guide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(this.state.organization.organization_we_vote_id, VoterStore.election_id())
    });
  }

  render () {
    renderLog(__filename);
    let turned_off = true; // We don't want to use the status bar yet
    if (turned_off) {
      return null;
    }
    let number_of_supporters_goal = 0;
    let number_of_supporters = 0;
    let percent_complete = 0;
    let voter_has_pledged = false;
    if (this.state.voter_guide) {
      // console.log("PledgeToSupportOrganizationStatusBar this.state.voter_guide: ", this.state.voter_guide);
      number_of_supporters = this.state.voter_guide.pledge_count || 0;
      number_of_supporters_goal = this.state.voter_guide.pledge_goal || 0;

      // So we can demo
      number_of_supporters += 50;
      number_of_supporters_goal = 100;

      if (number_of_supporters_goal !== 0) {
        let percent_complete_ratio = number_of_supporters / number_of_supporters_goal;
        let percent_complete_raw = percent_complete_ratio * 100;
        percent_complete = Math.round(percent_complete_raw);
        // console.log("percent_complete_raw: ", percent_complete_raw, "percent_complete: ", percent_complete);
        if (percent_complete < 30) {
          // Increase it to the minimum width, so there is room for the label
          percent_complete = 30;
        }
      }
      voter_has_pledged = this.state.voter_guide.voter_has_pledged;
      //console.log("PledgeToSupportOrganizationStatusBar voter_has_pledged:", voter_has_pledged, ", voter_guide_we_vote_id: ", this.state.voter_guide.we_vote_id);
    }
    let show_progress_bar = number_of_supporters_goal > 1 && number_of_supporters > 1;

    const progress_bar = <ProgressBar bsStyle={"danger"}
                                      className="u-stack--xs"
                                      striped
                                      now={percent_complete}
                                      label={`${number_of_supporters} supporters`} />;

    return <span>
      {show_progress_bar ? progress_bar : null}
      {number_of_supporters > 1 ? <div className="voter-guide__pledge-to-support__current-supporters u-stack--md">
          {number_of_supporters > 1 ? <span>{number_of_supporters} have pledged to stand with {this.props.organization.organization_name}. </span> : null }
          { percent_complete < 100 ?
            <span>{number_of_supporters > 1 && number_of_supporters_goal && !voter_has_pledged ? <span>Let's get to {number_of_supporters_goal}!</span> : null }
            {number_of_supporters > 1 && number_of_supporters_goal && voter_has_pledged ? <span>Share with friends so we can get to {number_of_supporters_goal}!</span> : null }</span> :
            null }
        </div> :
        null }
      {voter_has_pledged ?
        <div className="voter-guide__pledge-to-support__thank-you-for-supporting u-stack--md">
          Thank you for standing with {this.props.organization.organization_name}!
          {number_of_supporters === 1 && number_of_supporters_goal && voter_has_pledged && percent_complete < 100 ?
            <span> Share with friends so we can get to {number_of_supporters_goal}.</span> :
            null }
        </div> :
        null }
    </span>;
  }
}
