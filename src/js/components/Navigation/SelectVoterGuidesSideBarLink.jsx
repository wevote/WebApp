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
    const labelInSentenceCase = capitalizeString(this.props.label);
    const subtitleInSentenceCase = sentenceCaseString(this.props.subtitle);

    return (
      <span>
        {labelInSentenceCase && labelInSentenceCase !== "" ? (
          <div className="SettingsItem__summary__item-container">
            <div>
              <Link to={this.props.linkTo} className="BallotItem__summary__item">
                <span className="SettingsItem__summary__item__display-name">{labelInSentenceCase}</span>
                { this.props.displaySubtitles ? (
                  <span className="SettingsItem__summary__item__subtitle">
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
