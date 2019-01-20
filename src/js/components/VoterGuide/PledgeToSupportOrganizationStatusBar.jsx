import React, { Component } from "react";
import PropTypes from "prop-types";
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
      voterGuide: {},
    };
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.setState({
      organization: this.props.organization,
      voterGuide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(this.props.organization.organization_we_vote_id, VoterStore.election_id()),
    });
  }

  componentWillReceiveProps (nextProps) {
    // When a new organization is passed in, update this component to show the new data
    this.setState({
      organization: nextProps.organization,
      voterGuide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(nextProps.organization.organization_we_vote_id, VoterStore.election_id()),
    });
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    this.setState(prevState => (
      { voterGuide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(prevState.organization.organization_we_vote_id, VoterStore.election_id()) }
    ));
  }

  render () {
    renderLog(__filename);

    let numberOfSupportersGoal = 0;
    let numberOfSupporters = 0;
    let percentComplete = 0;
    let voterHasPledged = false;
    if (this.state.voterGuide) {
      // console.log("PledgeToSupportOrganizationStatusBar this.state.voterGuide: ", this.state.voterGuide);
      numberOfSupporters = this.state.voterGuide.pledge_count || 0;
      numberOfSupportersGoal = this.state.voterGuide.pledge_goal || 0;

      // So we can demo
      numberOfSupporters += 50;
      numberOfSupportersGoal = 100;

      if (numberOfSupportersGoal !== 0) {
        const percentCompleteRatio = numberOfSupporters / numberOfSupportersGoal;
        const percentCompleteRaw = percentCompleteRatio * 100;
        percentComplete = Math.round(percentCompleteRaw);
        // console.log("percentCompleteRaw: ", percentCompleteRaw, "percentComplete: ", percentComplete);
        if (percentComplete < 30) {
          // Increase it to the minimum width, so there is room for the label
          percentComplete = 30;
        }
      }

      voterHasPledged = this.state.voterGuide.voter_has_pledged;
      // console.log("PledgeToSupportOrganizationStatusBar voterHasPledged:", voterHasPledged, ", voter_guide_we_vote_id: ", this.state.voterGuide.we_vote_id);
    }

    // let show_progress_bar = numberOfSupportersGoal > 1 && numberOfSupporters > 1;
    //
    // const progress_bar = <ProgressBar variant={"danger"}
    //                                   bsPrefix="u-stack--xs"
    //                                   striped
    //                                   now={percentComplete}
    //                                   label={`${numberOfSupporters} supporters`} />;

    return (
      <span>
        {/* 2018-5-31 turning off progress bar for now
        {show_progress_bar ? progress_bar : null}
        {numberOfSupporters > 1 ? <div className="voter-guide__pledge-to-support__current-supporters u-stack--md">
            {numberOfSupporters > 1 ? <span>{numberOfSupporters} have pledged to stand with {this.props.organization.organization_name}. </span> : null }
            { percentComplete < 100 ?
              <span>{numberOfSupporters > 1 && numberOfSupportersGoal && !voterHasPledged ? <span>Let's get to {numberOfSupportersGoal}!</span> : null }
              {numberOfSupporters > 1 && numberOfSupportersGoal && voterHasPledged ? <span>Share with friends so we can get to {numberOfSupportersGoal}!</span> : null }</span> :
              null }
          </div> :
          null }
          */
        }
        { voterHasPledged ? (
          <div className="voter-guide__pledge-to-support__thank-you-for-supporting u-stack--md">
            Thank you for standing with
            {" "}
            {this.props.organization.organization_name}
            !
            {/* numberOfSupporters === 1 && numberOfSupportersGoal && voterHasPledged && percentComplete < 100 ?
            <span> Share with friends so we can get to {numberOfSupportersGoal}.</span> :
            null */}
          </div>
        ) : null
        }
      </span>
    );
  }
}
