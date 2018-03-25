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
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    let label_in_sentence_case = capitalizeString(this.props.label);
    let subtitle_in_sentence_case = sentenceCaseString(this.props.subtitle);

    return <div className="SettingsItem__summary__item-container" >
      <div>
        <Link to={this.props.linkTo} className="BallotItem__summary__item" >
          <span className="SettingsItem__summary__item__display-name">{label_in_sentence_case}</span>
          { this.props.displaySubtitles ?
            <span className="SettingsItem__summary__item__subtitle"><br /> {subtitle_in_sentence_case}</span> : null }
        </Link>
      </div>
    </div>;
  }
}
