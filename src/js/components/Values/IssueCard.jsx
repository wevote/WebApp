import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IssueFollowToggleButton from './IssueFollowToggleButton';
import IssueImageDisplay from './IssueImageDisplay';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import ReadMore from '../Widgets/ReadMore';

export default class IssueCard extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    followToggleOn: PropTypes.bool,
    issue: PropTypes.object.isRequired,
    issueImageSize: PropTypes.string,
    turnOffDescription: PropTypes.bool,
    turnOffIssueImage: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemWeVoteId: '',
      followToggleOn: false,
      issueImageSize: 'SMALL', // We support SMALL, MEDIUM, LARGE
      issueWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log("IssueCard, componentDidMount, this.props:", this.props);
    if (this.props.issue && this.props.issue.issue_we_vote_id) {
      const imageSizes = new Set(['SMALL', 'MEDIUM', 'LARGE']);
      let issueImageSize = 'SMALL'; // Set the default
      if (imageSizes.has(this.props.issueImageSize)) {
        ({ issueImageSize } = this.props);
      }
      this.setState({
        ballotItemWeVoteId: this.props.ballotItemWeVoteId,
        followToggleOn: this.props.followToggleOn,
        issue: this.props.issue,
        issueImageSize,
        issueWeVoteId: this.props.issue.issue_we_vote_id,
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log("IssueCard, componentWillReceiveProps, nextProps:", nextProps);
    if (nextProps.issue && nextProps.issue.issue_we_vote_id) {
      const imageSizes = new Set(['SMALL', 'MEDIUM', 'LARGE']);
      let issueImageSize = 'SMALL'; // Set the default
      if (imageSizes.has(nextProps.issueImageSize)) {
        ({ issueImageSize } = nextProps);
      }
      this.setState({
        ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
        followToggleOn: nextProps.followToggleOn,
        issue: nextProps.issue,
        issueImageSize,
        issueWeVoteId: nextProps.issue.issue_we_vote_id,
      });
    }
  }

  render () {
    renderLog(__filename);
    if (!this.state.issueWeVoteId.length) {
      return <div className="card-popover__width--minimum">{LoadingWheel}</div>;
    }

    let { issue_description: issueDescription, issue_name: issueDisplayName } = this.state.issue;

    issueDisplayName = issueDisplayName || '';
    issueDescription = issueDescription || '';

    let issueImage;
    let numberOfLines;
    if (this.state.issueImageSize === 'SMALL') {
      issueImage = (
        <IssueImageDisplay
          issueWeVoteId={this.state.issue.issue_we_vote_id}
          issueImageSize="SMALL"
          showPlaceholderImage
          turnOffIssueFade
        />
      );
      if (this.state.followToggleOn) {
        numberOfLines = 5; // Allow more vertical space for Follow button
      } else {
        numberOfLines = 2;
      }
    } else if (this.state.issueImageSize === 'MEDIUM') {
      issueImage = (
        <IssueImageDisplay
          issueWeVoteId={this.state.issue.issue_we_vote_id}
          issueImageSize="MEDIUM"
          showPlaceholderImage
          turnOffIssueFade
        />
      );
      if (this.state.followToggleOn) {
        numberOfLines = 6; // Allow more vertical space for Follow button
      } else {
        numberOfLines = 3;
      }
    } else if (this.state.issueImageSize === 'LARGE') {
      issueImage = (
        <IssueImageDisplay
          issueWeVoteId={this.state.issue.issue_we_vote_id}
          issueImageSize="LARGE"
          showPlaceholderImage
          turnOffIssueFade
        />
      );
      if (this.state.followToggleOn) {
        numberOfLines = 7; // Allow more vertical space for Follow button
      } else {
        numberOfLines = 4;
      }
    }


    return (
      <div
        className="card-main__media-object u-stack--md"
        key={`issue-card-${this.state.issueWeVoteId}`}
      >
        <div className="card-main__media-object-anchor">
          {this.props.turnOffIssueImage ?
            null :
            issueImage
          }
          {this.props.followToggleOn && this.state.issueWeVoteId ? (
            <div className="">
              <IssueFollowToggleButton
                ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                classNameOverride="pull-left"
                currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                issueName={this.state.issue.issue_name}
                issueWeVoteId={this.state.issueWeVoteId}
                urlWithoutHash={this.props.urlWithoutHash}
              />
            </div>
          ) : null
          }
        </div>
        <div className="card-main__media-object-content">
          <h3 className="card-main__display-name">{issueDisplayName}</h3>

          { !this.props.turnOffDescription ?
            <span className="card-main__description"><ReadMore text_to_display={issueDescription} num_of_lines={numberOfLines} /></span> :
            <span className="card-main__description" />
          }
        </div>
      </div>
    );
  }
}
