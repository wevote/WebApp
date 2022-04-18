import { Button } from '@mui/material';
import { Launch } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import TextTruncate from 'react-text-truncate'; // Replace with: import TruncateMarkup from 'react-truncate-markup';
import { renderLog } from '../../utils/logging';


const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './OpenExternalWebSite'));


class LearnMore extends Component {
  constructor (props) {
    super(props);

    this.state = {
      readMore: true,
    };
    this.onKeyDown = this.onKeyDown.bind(this);
    this.showMore = this.showMore.bind(this);
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

  showMore (event) {
    event.preventDefault();
    const { readMore } = this.state;
    this.setState({
      readMore: !readMore,
    });
  }

  render () {
    renderLog('LearnMore');  // Set LOG_RENDER_EVENTS to log all renders
    let {
      text_to_display: textToDisplay, num_of_lines: numOfLines,
      learn_more_text: learnMoreText,
    } = this.props;
    const {
      always_show_external_link: alwaysShowExternalLink, classes, learn_more_link: learnMoreLink,
      on_click: onClick, show_more_text: showMoreText,
    } = this.props;
    // default prop values
    if (numOfLines === undefined) {
      numOfLines = 1;
    }

    if (learnMoreText === undefined) {
      learnMoreText = 'learn more';
    }

    // remove extra ascii carriage returns or other control text
    textToDisplay = textToDisplay.replace(/[\x0D-\x1F]/g, '');  // eslint-disable-line no-control-regex

    // convert text into array, splitting on line breaks
    const expandedTextArray = textToDisplay.replace(/(?:\r\n|\r|\n){2,}/g, '\r\n\r\n').split(/(?:\r\n|\r|\n)/g);

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
    const expandedTextToDisplay = expandedTextArray.map((item, index) => {
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

    const externalLink = learnMoreLink ? (
      <Suspense fallback={<></>}>
        <OpenExternalWebSite
          linkIdAttribute="learnMore"
          url={learnMoreLink}
          target="_blank"
          body={(
            <span>
              {learnMoreText}
              &nbsp;
              <Launch
                style={{
                  height: 14,
                  marginLeft: 2,
                  marginTop: '-3px',
                  width: 14,
                }}
              />
            </span>
          )}
        />
      </Suspense>
    ) : (
      <Button
        color="primary"
        classes={{ root: classes.headerButtonRoot }}
        onClick={onClick}
        onKeyDown={this.onKeyDown}
      >
        {learnMoreText}
      </Button>
    );
    if (notEnoughTextToTruncate) {
      return (
        <span>
          {expandedTextToDisplay}
          {alwaysShowExternalLink &&
            externalLink}
        </span>
      );
    }
    // console.log('numOfLines: ', numOfLines, ', textToDisplay: ', textToDisplay, ', readMore:', this.state.readMore, ', showMoreText:', showMoreText, ', learnMoreText:', learnMoreText, ', learnMoreLink:', learnMoreLink);
    if (this.state.readMore) {
      return (
        <span>
          <TextTruncate
            line={numOfLines}
            truncateText="..."
            text={textToDisplay}
            textTruncateChild={showMoreText ? (
              <Button
                color="primary"
                classes={{ root: classes.headerButtonRoot }}
                onClick={this.showMore}
                onKeyDown={this.onKeyDown}
              >
                {showMoreText}
              </Button>
            ) : null}
          />
        </span>
      );
    } else {
      return (
        <span>
          {' '}
          {expandedTextToDisplay}
          &nbsp;&nbsp;
          {externalLink}
        </span>
      );
    }
  }
}
LearnMore.propTypes = {
  classes: PropTypes.object,
  text_to_display: PropTypes.node.isRequired,
  show_more_text: PropTypes.string,
  learn_more_link: PropTypes.string,
  learn_more_text: PropTypes.string,
  num_of_lines: PropTypes.number,
  on_click: PropTypes.func,
  always_show_external_link: PropTypes.bool,
};

const styles = (theme) => ({
  headerButtonRoot: {
    paddingTop: 2,
    paddingBottom: 2,
    '&:hover': {
      backgroundColor: 'transparent',
    },
    color: 'rgb(6, 95, 212)',
    marginLeft: '1rem',
    outline: 'none !important',
    [theme.breakpoints.down('md')]: {
      marginLeft: '.1rem',
    },
  },
});

export default withStyles(styles)(LearnMore);
