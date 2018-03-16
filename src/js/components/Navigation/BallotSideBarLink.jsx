import React, { Component, PropTypes } from "react";
import { capitalizeString, sentenceCaseString } from "../../utils/textFormat";


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
    let label_in_sentence_case = capitalizeString(this.props.label);
    let subtitle_in_sentence_case = sentenceCaseString(this.props.subtitle);

    return <div className="BallotItem__summary__item-container" onClick={this.props.onClick.bind(this) }>
      <div>
        <a href={this.props.url} className="BallotItem__summary__item" >
          <span className="BallotItem__summary__item__display-name">{label_in_sentence_case}</span>
          { this.props.displaySubtitles ?
            <span className="BallotItem__summary__item__subtitle"> {subtitle_in_sentence_case}</span> : null }
        </a>
      </div>
    </div>;
  }
}
