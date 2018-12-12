import React, { Component } from "react";
import PropTypes from "prop-types";
import TextTruncate from "react-text-truncate";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import { renderLog } from "../../utils/logging";

export default class LearnMore extends Component {
  static propTypes = {
    text_to_display: PropTypes.node.isRequired,
    show_more_text: PropTypes.node,
    learn_more_link: PropTypes.string,
    learn_more_text: PropTypes.node,
    num_of_lines: PropTypes.number,
    on_click: PropTypes.func,
    always_show_external_link: PropTypes.bool,
  };

  constructor (props) {
    super(props);

    this.state = {
      readMore: true,
    };
    this.showMore = this.showMore.bind(this);
  }

  showMore (event) {
    event.preventDefault();
    this.setState({
      readMore: !this.state.readMore,
    });
  }

  // this onKeyDown function is for accessibility: both toggle links
  // have a tab index so that users can use tab key to select the link, and then
  // press either space or enter (key codes 32 and 13, respectively) to toggle
  onKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.showMore(event);
    }
  }

  render () {
    renderLog(__filename);
    let {
      text_to_display: textToDisplay, show_more_text: showMoreText, num_of_lines: numOfLines,
      learn_more_text: learnMoreText,
    } = this.props;
    const {
      learn_more_link: learnMoreLink, on_click: onClick, always_show_external_link: alwaysShowExternalLink,
    } = this.props;
    // default prop values
    if (numOfLines === undefined) {
      numOfLines = 1;
    }

    if (showMoreText === undefined) {
      showMoreText = "more";
    }

    if (learnMoreText === undefined) {
      learnMoreText = "learn more";
    }

    // remove extra ascii carriage returns or other control text
    textToDisplay = textToDisplay.replace(/[\x0D-\x1F]/g, "");  // eslint-disable-line no-control-regex

    // convert text into array, splitting on line breaks
    const expandedTextArray = textToDisplay.replace(/(?:\r\n|\r|\n){2,}/g, "\r\n\r\n").split(/(?:\r\n|\r|\n)/g);

    // There are cases where we would like to show line breaks when there is a little bit of text
    let notEnoughTextToTruncate = false;
    let allLinesShort = true;
    let maxNumOfLines = numOfLines;

    // max number of lines shouldn't be greater than total number of line breaks hard coded
    if (maxNumOfLines > expandedTextArray.length) {
      maxNumOfLines = expandedTextArray.length;
    }

    for (let i = 0; i < maxNumOfLines; i++) {
      if (expandedTextArray[i].length > 38) {
        allLinesShort = false;
        break;
      }
    }

    //  The '&&' in the next line is pretty fishy, probably should be a '+', Steve July 2018
    if (expandedTextArray.length <= numOfLines && allLinesShort) {
      notEnoughTextToTruncate = true;
    }

    // wrap text in array in separate spans with html line breaks
    const expandedTextToDisplay = expandedTextArray.map((item, key) => {
      if (key === 0) {
        return (
          <span key={key}>
            {item}
          </span>
        );
      } else if (key >= expandedTextArray.length - 2 && item === "") {
        return (
          <span key={key}>
            {item}
          </span>
        );
      } else {
        return (
          <span key={key}>
            <br />
            {item}
          </span>
        );
      }
    });

    const externalLink = learnMoreLink ? (
      <OpenExternalWebSite
        url={learnMoreLink}
        target="_blank"
        body={(
          <span>
            {learnMoreText}
            &nbsp;
            <i className="fa fa-external-link" />
          </span>
        )}
      />
    ) : (
      <a
        onClick={onClick}
        onKeyDown={this.onKeyDown.bind(this)}
      >
        {learnMoreText}
      </a>
    );
    if (notEnoughTextToTruncate) {
      return (
        <span>
          {expandedTextToDisplay}
          {
        alwaysShowExternalLink &&
        externalLink
      }
        </span>
      );
    }

    if (this.state.readMore) {
      return (
        <span>
          <TextTruncate
            line={numOfLines}
            truncateText="..."
            text={textToDisplay}
            textTruncateChild={(
              <a
                onClick={this.showMore}
                onKeyDown={this.onKeyDown.bind(this)}
              >
                {showMoreText}
              </a>
            )}
          />
        </span>
      );
    } else {
      return (
        <span>
          {" "}
          {expandedTextToDisplay}
          &nbsp;&nbsp;
          {
          externalLink
        }
        </span>
      );
    }
  }
}
