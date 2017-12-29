import React, { PropTypes, Component } from "react";
import { ProgressBar } from "react-bootstrap";
import VoterGuideStore from "../../stores/VoterGuideStore";

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
      voter_guide: VoterGuideStore.getVoterGuideForOrganizationId(this.props.organization.organization_we_vote_id),
    });
  }

  componentWillReceiveProps (nextProps) {
    // When a new organization is passed in, update this component to show the new data
    this.setState({
      organization: nextProps.organization,
      voter_guide: VoterGuideStore.getVoterGuideForOrganizationId(nextProps.organization.organization_we_vote_id),
    });
  }

  componentWillUnmount (){
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange (){
    this.setState({
      voter_guide: VoterGuideStore.getVoterGuideForOrganizationId(this.state.organization.organization_we_vote_id)
    });
  }

  render () {
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
      number_of_supporters_goal = 150;

      if (number_of_supporters_goal !== 0) {
        let percent_complete_ratio = number_of_supporters / number_of_supporters_goal;
        let percent_complete_raw = percent_complete_ratio * 100;
        percent_complete = Math.round(percent_complete_raw);
        // console.log("percent_complete_raw: ", percent_complete_raw, "percent_complete: ", percent_complete);
      }
      voter_has_pledged = this.state.voter_guide.voter_has_pledged;
      //console.log("PledgeToSupportOrganizationStatusBar voter_has_pledged:", voter_has_pledged, ", voter_guide_we_vote_id: ", this.state.voter_guide.we_vote_id);
    }
    let show_progress_bar = number_of_supporters_goal > 0;

    const progress_bar = <ProgressBar bsStyle={"danger"}
                                      className="u-stack--xs"
                                      striped
                                      now={percent_complete}
                                      label={`${number_of_supporters} supporters`} />;

    return <span>
      {show_progress_bar ? progress_bar : null}
      {voter_has_pledged ?
        <div className="voter-guide__pledge-to-support__thank-you-for-supporting u-stack--md">
          Thank you for standing with {this.props.organization.organization_name}!
        </div> :
        null }
      {number_of_supporters > 1 ?
        <div className="voter-guide__pledge-to-support__current-supporters u-stack--md">
          {number_of_supporters} have pledged to stand with {this.props.organization.organization_name}.
          {number_of_supporters_goal ? <span> Let's get to {number_of_supporters_goal}!</span> : null }
        </div> :
        null
      }
    </span>;
  }
}
