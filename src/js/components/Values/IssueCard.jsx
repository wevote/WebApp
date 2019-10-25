/* eslint-disable quotes */
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
import VoterGuideStore from '../../stores/VoterGuideStore';

class IssueCard extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    followToggleOn: PropTypes.bool,
    includeLinkToIssue: PropTypes.bool,
    issue: PropTypes.object.isRequired,
    issueImageSize: PropTypes.string,
    turnOffDescription: PropTypes.bool,
    turnOffIssueImage: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
    condensed: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemWeVoteId: '',
      countOfOrganizationsUnderThisIssue: 0,
      issue: {},
      issueImageSize: 'SMALL', // We support SMALL, MEDIUM, LARGE
      issueWeVoteId: '',
    };
    this.getIssueLink = this.getIssueLink.bind(this);
  }

  componentDidMount () {
    // console.log("IssueCard, componentDidMount, this.props:", this.props);
    if (this.props.issue && this.props.issue.issue_we_vote_id) {
      const { issue_we_vote_id: issueWeVoteId } = this.props.issue;
      const imageSizes = new Set(['SMALL', 'MEDIUM', 'LARGE']);
      let issueImageSize = 'SMALL'; // Set the default
      if (imageSizes.has(this.props.issueImageSize)) {
        ({ issueImageSize } = this.props);
      }
      this.setState({
        ballotItemWeVoteId: this.props.ballotItemWeVoteId,
        countOfOrganizationsUnderThisIssue: VoterGuideStore.getVoterGuidesForValue(issueWeVoteId).length,
        issue: this.props.issue,
        issueImageSize,
        issueWeVoteId,
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log("IssueCard, componentWillReceiveProps, nextProps:", nextProps);
    if (nextProps.issue && nextProps.issue.issue_we_vote_id) {
      const { issue_we_vote_id: issueWeVoteId } = nextProps.issue;
      const imageSizes = new Set(['SMALL', 'MEDIUM', 'LARGE']);
      let issueImageSize = 'SMALL'; // Set the default
      if (imageSizes.has(nextProps.issueImageSize)) {
        ({ issueImageSize } = nextProps);
      }
      this.setState({
        ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
        countOfOrganizationsUnderThisIssue: VoterGuideStore.getVoterGuidesForValue(issueWeVoteId).length,
        issue: nextProps.issue,
        issueImageSize,
        issueWeVoteId,
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.issueWeVoteId !== nextState.issueWeVoteId) {
      // console.log('this.state.issueWeVoteId', this.state.issueWeVoteId, ', nextState.issueWeVoteId', nextState.issueWeVoteId);
      return true;
    }
    if (this.state.countOfOrganizationsUnderThisIssue !== nextState.countOfOrganizationsUnderThisIssue) {
      // console.log('this.state.countOfOrganizationsUnderThisIssue', this.state.countOfOrganizationsUnderThisIssue, ', nextState.countOfOrganizationsUnderThisIssue', nextState.countOfOrganizationsUnderThisIssue);
      return true;
    }

    return false;
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
    renderLog('IssueCard');  // Set LOG_RENDER_EVENTS to log all renders
    const { countOfOrganizationsUnderThisIssue } = this.state;
    if (!this.state.issueWeVoteId.length) {
      return <div className="card-popover__width--minimum">{LoadingWheel}</div>;
    }

    let { issue_description: issueDescription, issue_name: issueDisplayName } = this.state.issue;

    issueDisplayName = issueDisplayName || '';
    issueDescription = issueDescription || '';

    let issueImage;
    const numberOfLines = 3;
    if (this.state.issueImageSize === 'SMALL') {
      issueImage = (
        <IssueImageDisplay
          issueWeVoteId={this.state.issue.issue_we_vote_id}
          issueImageSize="SMALL"
          showPlaceholderImage
          turnOffIssueFade
        />
      );
    } else if (this.state.issueImageSize === 'MEDIUM') {
      issueImage = (
        <IssueImageDisplay
          issueWeVoteId={this.state.issue.issue_we_vote_id}
          issueImageSize="MEDIUM"
          showPlaceholderImage
          turnOffIssueFade
        />
      );
    } else if (this.state.issueImageSize === 'LARGE') {
      issueImage = (
        <IssueImageDisplay
          issueWeVoteId={this.state.issue.issue_we_vote_id}
          issueImageSize="LARGE"
          showPlaceholderImage
          turnOffIssueFade
        />
      );
    }

    const { issueWeVoteId, ballotItemWeVoteId } = this.state;
    const { turnOffIssueImage, includeLinkToIssue, followToggleOn, turnOffDescription, currentBallotIdInUrl, urlWithoutHash } = this.props;
    return (
      <Wrapper
        key={`issue-card-${issueWeVoteId}`}
        className={this.props.condensed ? "card u-full-height" : "card u-inset__h--md u-padding-top--md u-padding-bottom--xs u-full-height"}
        condensed={!!this.props.condensed}
      >
        <Flex condensed={!!this.props.condensed}>
          <div className="card-main__media-object-anchor">
            {!turnOffIssueImage && (
              <span>
                {includeLinkToIssue ? (
                  <Link to={this.getIssueLink}
                        className="u-no-underline"
                  >
                    {issueImage}
                  </Link>
                ) : (
                  <span>
                    {issueImage}
                  </span>
                )}
              </span>
            )
            }
          </div>
          <>
            {includeLinkToIssue ? (
              <Link to={this.getIssueLink}
                    className="u-no-underline"
              >
                <IssueName>{`${issueDisplayName} (${countOfOrganizationsUnderThisIssue})`}</IssueName>
              </Link>
            ) :
              <IssueName>{`${issueDisplayName} (${countOfOrganizationsUnderThisIssue})`}</IssueName>
            }
          </>
          {followToggleOn && issueWeVoteId ? (
            <FollowToggleContainer>
              <IssueFollowToggleButton
                ballotItemWeVoteId={ballotItemWeVoteId}
                classNameOverride="pull-left"
                currentBallotIdInUrl={currentBallotIdInUrl}
                issueName={this.state.issue.issue_name}
                issueWeVoteId={issueWeVoteId}
                urlWithoutHash={urlWithoutHash}
              />
            </FollowToggleContainer>
          ) : null
          }
        </Flex>
        { !turnOffDescription && !this.props.condensed && (
        <Description>
            { includeLinkToIssue ? (
              <Link to={this.getIssueLink}
                      className="u-no-underline"
              >
                <ReadMore text_to_display={issueDescription}
                          num_of_lines={numberOfLines}
                />
              </Link>
            ) : (
              <ReadMore text_to_display={issueDescription}
                          num_of_lines={numberOfLines}
              />
            )
              }
        </Description>
        )
        }
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  background: white;
  border: ${props => (props.condensed ? '1px solid #888' : 'none')};
  box-shadow: ${props => (props.condensed ? 'none !important' : null)};
  padding: ${props => (props.condensed ? '16px 12px' : null)};
  height: ${props => (props.condensed ? 'fit-content' : null)};
  margin: ${props => (props.condensed ? '4px 0' : null)};
`;

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
  width: ${props => (props.condensed ? '100%' : null)};
`;

const Description = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #333;
`;

export default IssueCard;
