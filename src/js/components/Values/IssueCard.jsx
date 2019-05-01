import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import IssueFollowToggleButton from './IssueFollowToggleButton';
import IssueImageDisplay from './IssueImageDisplay';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import ReadMore from '../Widgets/ReadMore';
import { convertNameToSlug } from '../../utils/textFormat';

class IssueCard extends Component {
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
      issue: {},
      issueImageSize: 'SMALL', // We support SMALL, MEDIUM, LARGE
      issueWeVoteId: '',
    };
    this.getIssueLink = this.getIssueLink.bind(this);
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

  getIssueLink () {
    const { issue } = this.state;
    if (issue && issue.issue_name) {
      const issueSlug = convertNameToSlug(issue.issue_name);
      return `/value/${issueSlug}`;
    } else {
      return '';
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
      <div className="col col-12 col-md-6 u-stack--md">
        <div
          key={`issue-card-${this.state.issueWeVoteId}`}
          className="card u-inset--md u-full-height"
        >
          <Flex>
            <div className="card-main__media-object-anchor">
              {this.props.turnOffIssueImage ?
                null :
                (
                  <Link to={this.getIssueLink}
                    className="u-no-underline"
                  >
                    {issueImage}
                  </Link>
                )
              }
            </div>
            <IssueName>
              <Link to={this.getIssueLink}
                    className="u-no-underline"
              >
                <h3 className="card-main__display-name">{issueDisplayName}</h3>
              </Link>
            </IssueName>
            {this.props.followToggleOn && this.state.issueWeVoteId ? (
              <FollowToggleContainer>
                <IssueFollowToggleButton
                  ballotItemWeVoteId={this.state.ballotItemWeVoteId}
                  classNameOverride="pull-left"
                  currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                  issueName={this.state.issue.issue_name}
                  issueWeVoteId={this.state.issueWeVoteId}
                  urlWithoutHash={this.props.urlWithoutHash}
                />
              </FollowToggleContainer>
            ) : null
            }
          </Flex>
          { this.props.turnOffDescription ?
            <span className="card-main__description" /> :
            (
              <Description>
                <Link to={this.getIssueLink}
                      className="u-no-underline"
                >
                  <ReadMore text_to_display={issueDescription}
                            num_of_lines={numberOfLines}
                  />
                </Link>
              </Description>
            )
          }
        </div>
      </div>
    );
  }
}

const IssueName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0;
`;

const FollowToggleContainer = styled.div`
  margin-left: auto;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Description = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #333;
`;

export default IssueCard;
