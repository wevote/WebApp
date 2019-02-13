import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { capitalizeString, sentenceCaseString } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";


export default class SelectVoterGuidesSideBarLink extends Component {
  static propTypes = {
    linkTo: PropTypes.string,
    label: PropTypes.string,
    subtitle: PropTypes.string,
    displaySubtitles: PropTypes.bool,
    voterGuideWeVoteId: PropTypes.string,
    voterGuideWeVoteIdSelected: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      voterGuideWeVoteId: "",
      voterGuideWeVoteIdSelected: "",
    };
  }

  componentDidMount () {
    this.setState({
      voterGuideWeVoteId: this.props.voterGuideWeVoteId,
      voterGuideWeVoteIdSelected: this.props.voterGuideWeVoteIdSelected,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      voterGuideWeVoteId: nextProps.voterGuideWeVoteId,
      voterGuideWeVoteIdSelected: nextProps.voterGuideWeVoteIdSelected,
    });
  }

  render () {
    renderLog(__filename);
    const labelInSentenceCase = capitalizeString(this.props.label);
    const subtitleInSentenceCase = sentenceCaseString(this.props.subtitle);

    const atStateIsOnThisVoterGuide = this.state.voterGuideWeVoteIdSelected && this.state.voterGuideWeVoteIdSelected === this.state.voterGuideWeVoteId;

    return (
      <span>
        {labelInSentenceCase && labelInSentenceCase !== "" ? (
          <div className={atStateIsOnThisVoterGuide ?
            "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
            "SettingsItem__summary__item-container "}
          >
            <div>
              <Link to={this.props.linkTo} className="BallotItem__summary__item">
                <span className={atStateIsOnThisVoterGuide ?
                  "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                  "SettingsItem__summary__item__display-name"}
                >
                  {labelInSentenceCase}
                </span>
                { this.props.displaySubtitles ? (
                  <span className={atStateIsOnThisVoterGuide ?
                    "SettingsItem__summary__item__subtitle SettingsItem__summary__item__subtitle--selected" :
                    "SettingsItem__summary__item__subtitle"}
                  >
                    <br />
                    {" "}
                    {subtitleInSentenceCase}
                  </span>
                ) : null }
              </Link>
            </div>
          </div>
        ) :
          null
      }
      </span>
    );
  }
}
