import React, { Component } from "react";
import PropTypes from "prop-types";
import { capitalizeString, sentenceCaseString } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";
import { Link } from "react-router";
export default class BallotSideBarLink extends Component {
  static propTypes = {
    ballotItemLinkHasBeenClicked: PropTypes.func,
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
    renderLog(__filename);
    let labelInSentenceCase = capitalizeString(this.props.label);
    let subtitleInSentenceCase = sentenceCaseString(this.props.subtitle);

    return <div className="BallotItem__summary__item-container" onClick={() => {
      this.props.onClick.bind(this);
      if (this.props.ballotItemLinkHasBeenClicked && this.props.url){
        const selectedBallotItemId = this.props.url.split("#")[1];
        this.props.ballotItemLinkHasBeenClicked(selectedBallotItemId);
      }
    }}>
      <div>
        <Link to={this.props.url} className="BallotItem__summary__item__display-name" >
          <span className="BallotItem__summary__display-name">{labelInSentenceCase}</span>
          { this.props.displaySubtitles ?
            <span className="BallotItem__summary__item__subtitle"> {subtitleInSentenceCase}</span> : null }
        </Link>
      </div>
    </div>;
  }
}
