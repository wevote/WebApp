import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextTruncate from 'react-text-truncate';
import { renderLog } from '../../utils/logging';

export default class ReadMore extends Component {
  static propTypes = {
    text_to_display: PropTypes.node.isRequired,
    link_text: PropTypes.node,
    collapse_text: PropTypes.node,
    num_of_lines: PropTypes.number,
    className: PropTypes.string,
  };

  constructor (...args) {
    super(...args);

    this.state = {
      readMore: true,
    };
    this.toggleLines = this.toggleLines.bind(this);
  }

  // this onKeyDown function is for accessibility: both toggle links
  // have a tab index so that users can use tab key to select the link, and then
  // press either space or enter (key codes 32 and 13, respectively) to toggle
  onKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.toggleLines(event);
    }
  }

  toggleLines (event) {
    event.preventDefault();
    const { readMore } = this.state;
    this.setState({
      readMore: !readMore,
    });
  }

  render () {
    renderLog(__filename);
    let {
      text_to_display: textToDisplay, link_text: linkText, num_of_lines: numOfLines, collapse_text: collapseText,
    } = this.props;
    // default prop valuess
    if (numOfLines === undefined) {
      numOfLines = 3;
    }
    if (linkText === undefined) {
      linkText = 'More';
    }
    if (collapseText === undefined) {
      collapseText = 'Show Less  ';
    }

    // remove extra ascii carriage returns or other control text
    textToDisplay = textToDisplay.replace(/[\x0D-\x1F]/g, ''); // eslint-disable-line no-control-regex
    // convert text into array, splitting on line breaks
    const expandedTextArray = textToDisplay.replace(/(?:\r\n|\r|\n){2,}/g, '\r\n\r\n').split(/(?:\r\n|\r|\n)/g);

    // There are cases where we would like to show line breaks when there is a little bit of text
    let notEnoughTextToTruncate = false;
    let allLinesShort = true;
    let maxNumOfLines = numOfLines;
    // max num of lines shouldn't be greater than the total num of line breaks hard coded
    if (maxNumOfLines > expandedTextArray.length) {
      maxNumOfLines = expandedTextArray.length;
    }
    for (let i = 0; i < maxNumOfLines; i++) {
      if (expandedTextArray[i].length > 38) {
        allLinesShort = false;
        break;
      }
    }
    if (expandedTextArray.length <= numOfLines && allLinesShort) {
      notEnoughTextToTruncate = true;
    }
    // wrap text in array in separate spans with html line breaks
    const expandedTextToDisplay = expandedTextArray.map((item, index) => { // https://dev.to/jtonzing/the-significance-of-react-keys---a-visual-explanation--56l7
      if (index === 0) {
        return (
          <span key={`key-${item}`}>
            {item}
          </span>
        );
      } else if (index >= expandedTextArray.length - 2 && item === '') {
        return (
          <span key={`key-${item}`}>
            {item}
          </span>
        );
      } else {
        return (
          <span key={`key-${item}`}>
            <br />
            {item}
          </span>
        );
      }
    });

    if (notEnoughTextToTruncate) {
      return <span className={this.props.className}>{expandedTextToDisplay}</span>;
    }
    if (this.state.readMore) {
      return (
        <span>
          <TextTruncate
            containerClassName={this.props.className}
            line={numOfLines}
            truncateText="..."
            text={textToDisplay}
            textTruncateChild={(
              <a // eslint-disable-line
                tabIndex="0"
                href="#"
                onClick={this.toggleLines}
                onKeyDown={this.onKeyDown.bind(this)}
              >
                {linkText}
              </a>
            )}
          />
        </span>
      );
    } else {
      return (
        <span className={this.props.className}>
          {' '}
          {expandedTextToDisplay}
          &nbsp;&nbsp;
          <a // eslint-disable-line
            tabIndex="0"
            href="#"
            onClick={this.toggleLines}
            onKeyDown={this.onKeyDown.bind(this)}
          >
            {collapseText}
          </a>
        </span>
      );
    }
  } // end render
}
