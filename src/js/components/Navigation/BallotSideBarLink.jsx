import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ListItem from '@material-ui/core/ListItem';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { capitalizeString, sentenceCaseString, shortenText } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';

class BallotSideBarLink extends Component {
  static propTypes = {
    ballotItemLinkHasBeenClicked: PropTypes.func,
    url: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    subtitle: PropTypes.string,
    displaySubtitles: PropTypes.bool,
    onClick: PropTypes.func,
    plainTextLink: PropTypes.bool,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    const labelInSentenceCase = capitalizeString(this.props.label);
    const subtitleInSentenceCase = sentenceCaseString(this.props.subtitle);

    return (
      <>
        {this.props.plainTextLink ? (
          <Link id={this.props.id} to={this.props.url}>
            <Button
              classes={{ root: classes.button }}
              variant="text"
              onClick={() => {
                this.props.onClick.bind(this);
                if (this.props.ballotItemLinkHasBeenClicked && this.props.url) {
                  const selectedBallotItemId = this.props.url.split('#')[1];
                  if (selectedBallotItemId) {
                    this.props.ballotItemLinkHasBeenClicked(selectedBallotItemId);
                  }
                }
              }}
            >
              <span>{shortenText(labelInSentenceCase, 26)}</span>
              { this.props.displaySubtitles ? (
                <span className="BallotItem__summary__item__subtitle">
                  {' '}
                  {shortenText(subtitleInSentenceCase, 26)}
                </span>
              ) : null }
            </Button>
          </Link>
        ) : (
          <Link id={this.props.id} to={this.props.url} className="BallotItem__summary__item__display-name">
            <ListItem
              button
              onClick={() => {
                this.props.onClick.bind(this);
                if (this.props.ballotItemLinkHasBeenClicked && this.props.url) {
                  const selectedBallotItemId = this.props.url.split('#')[1];
                  if (selectedBallotItemId) {
                    this.props.ballotItemLinkHasBeenClicked(selectedBallotItemId);
                  }
                }
              }}
            >
              <div>
                <span className="BallotItem__summary__display-name">{labelInSentenceCase}</span>
                { this.props.displaySubtitles ? (
                  <span className="BallotItem__summary__item__subtitle">
                    {' '}
                    {subtitleInSentenceCase}
                  </span>
                ) : null }
              </div>
            </ListItem>
          </Link>
        )}
      </>
    );
  }
}

const styles = () => ({
  button: {
    background: 'transparent !important',
    textAlign: 'left',
    paddingLeft: 0,
    paddingRight: 0,
    textTransform: 'capitalize',
  },
});

export default withStyles(styles)(BallotSideBarLink);
