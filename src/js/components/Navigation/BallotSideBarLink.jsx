import React, { Component, PropTypes } from "react";
import { sentenceCaseString } from "../../utils/textFormat";


export default class BallotSideBarLink extends Component {
  static propTypes = {
    url: PropTypes.string,
    label: PropTypes.string,
    subtitle: PropTypes.string,
    displaySubtitles: PropTypes.bool,
    onClick: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    let subtitle_in_sentence_case = sentenceCaseString(this.props.subtitle);

    return <div className="BallotItem__summary-item-container" onClick={this.props.onClick.bind(this) }>
      <div>
        <a href={this.props.url} className="BallotItem__summary-item" >
          <span className="BallotItem__summary-display-name">{this.props.label}</span>
          { this.props.displaySubtitles ?
            <span className="BallotItem__summary-subtitle"> {subtitle_in_sentence_case}</span> : null }
        </a>
      </div>
    </div>;
  }
}
