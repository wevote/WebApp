import React, { Component } from "react";
import PropTypes from "prop-types";
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
    let labelInSentenceCase = capitalizeString(this.props.label);
    let subtitleInSentenceCase = sentenceCaseString(this.props.subtitle);

    return <div className="BallotItem__summary__item-container" onClick={this.props.onClick.bind(this) }>
      <div>
        <a href={this.props.url} className="BallotItem__summary__item__display-name" >
          <span className="BallotItem__summary__display-name">{labelInSentenceCase}</span>
          { this.props.displaySubtitles ?
            <span className="BallotItem__summary__item__subtitle"> {subtitleInSentenceCase}</span> : null }
        </a>
      </div>
    </div>;
  }
}
