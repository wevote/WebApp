import React, { Component, PropTypes } from "react";
import { sentenceCaseString } from "../../utils/textFormat";


export default class BallotSideBarLink extends Component {
  static propTypes = {
    url: PropTypes.string,
    label: PropTypes.string,
    subtitle: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    let subtitle_in_sentence_case = sentenceCaseString(this.props.subtitle);

    return <div className="BallotItem__summary-item-container">
      <div>
        <a href={this.props.url}>
          <span className="BallotItem__summary-display-name">{this.props.label}</span>
          <span className="BallotItem__summary-item"> {subtitle_in_sentence_case}</span>
        </a>
      </div>
    </div>;
  }
}
