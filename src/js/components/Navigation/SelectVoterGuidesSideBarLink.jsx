import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { capitalizeString, sentenceCaseString } from "../../utils/textFormat";


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
    let label_in_sentence_case = capitalizeString(this.props.label);
    let subtitle_in_sentence_case = sentenceCaseString(this.props.subtitle);

    return <div className="BallotItem__summary__item-container" >
      <div>
        <Link to={this.props.linkTo} className="BallotItem__summary__item" >
          <span className="BallotItem__summary__display-name">{label_in_sentence_case}</span>
          { this.props.displaySubtitles ?
            <span className="BallotItem__summary-subtitle"><br /> {subtitle_in_sentence_case}</span> : null }
        </Link>
      </div>
    </div>;
  }
}
