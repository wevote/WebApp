import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { shortenText } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";

export default class PledgeToSupportOrganizationButton extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    pledgeToVoteAction: PropTypes.func.isRequired,
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

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    this.setState({
      voter_guide: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(this.state.organization.organization_we_vote_id, VoterStore.election_id()),
    });
    // console.log("voter_guide object ", this.state.voter_guide.we_vote_id);
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter_guide || !this.state.voter_guide.we_vote_id) {
      return null;
    }

    // Turn off the button if voter has already pledged
    if (this.state.voter_guide.voter_has_pledged) {
      return null;
    }

    // console.log("PledgeToSupportOrganizationButton, this.state.voter_guide: ", this.state.voter_guide);

    let iStandWithText = "I Stand With " + this.props.organization.organization_name;
    let iStandWithTextMobile = shortenText(iStandWithText, 32);

    return <span>
      <Button block
              size={"large"}
              variant={"danger"}
              onClick={() => { this.props.pledgeToVoteAction(); }
              }>
        <span className="voter-guide__pledge-to-support__i-stand-with-button d-none d-sm-block">{iStandWithText}</span>
        <span className="voter-guide__pledge-to-support__i-stand-with-button d-block d-sm-none">{iStandWithTextMobile}</span>
      </Button>
      <div className="voter-guide__pledge-to-support__i-stand-with-button-description u-stack--md">
        {"Click this button to match what " + this.props.organization.organization_name + " supports or opposes."}
        </div>
    </span>;
  }
}
