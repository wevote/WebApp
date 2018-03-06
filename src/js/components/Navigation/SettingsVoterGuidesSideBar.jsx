import React, { PropTypes, Component } from "react";
import ElectionStore from "../../stores/ElectionStore";
import SettingsVoterGuidesSideBarLink from "./SettingsVoterGuidesSideBarLink";
import VoterGuideStore from "../../stores/VoterGuideStore";


export default class SettingsVoterGuidesSideBar extends Component {
  static propTypes = {
    editMode: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    let voterGuidesOwnedByVoter = VoterGuideStore.getAllVoterGuidesOwnedByVoter();
    let voterGuideLinksHtml = <span />;
    if (voterGuidesOwnedByVoter) {
      voterGuideLinksHtml = voterGuidesOwnedByVoter.map((voter_guide, key) => {
        let displaySubtitles = true;
        return <div key={key}>
          <SettingsVoterGuidesSideBarLink linkTo={"/vg/" + voter_guide.we_vote_id + "/settings"}
                             label={ElectionStore.getElectionName(voter_guide.google_civic_election_id)}
                             subtitle={ElectionStore.getElectionDayText(voter_guide.google_civic_election_id)}
                             displaySubtitles={displaySubtitles}
                             />
        </div>;
      });
    }
    return <div className="container-fluid card">
      <div className="SettingsItem__summary__title">Your Voter Guides</div>
        <SettingsVoterGuidesSideBarLink linkTo={"#"}
                               label={"Create New Voter Guide"}
                               />

        {voterGuideLinksHtml}
      </div>;
  }
}
