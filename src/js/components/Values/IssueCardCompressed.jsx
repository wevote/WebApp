import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import IssueFollowToggleButton from './IssueFollowToggleButton';
import { convertNameToSlug } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';
import IssueImageDisplay from './IssueImageDisplay';
import ReadMore from '../Widgets/ReadMore';

class IssueCardCompressed extends Component {
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
      // followToggleOn: false,
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
        // followToggleOn: this.props.followToggleOn,
        issue: this.props.issue,
        issueImageSize,
        issueWeVoteId: this.props.issue.issue_we_vote_id,
      });
    }
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log("IssueCard, componentWillReceiveProps, nextProps:", nextProps);
    if (nextProps.issue && nextProps.issue.issue_we_vote_id) {
      const imageSizes = new Set(['SMALL', 'MEDIUM', 'LARGE']);
      let issueImageSize = 'SMALL'; // Set the default
      if (imageSizes.has(nextProps.issueImageSize)) {
        ({ issueImageSize } = nextProps);
      }
      this.setState({
        ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
        // followToggleOn: nextProps.followToggleOn,
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
    renderLog('IssueCardCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    // if (!this.state.issueWeVoteId.length) {
    //   return <div className="card-popover__width--minimum">{LoadingWheel}</div>;
    // }

    let { issue_description: issueDescription, issue_name: issueDisplayName } = this.state.issue;

    issueDisplayName = issueDisplayName || '';
    issueDescription = issueDescription || '';

    let issueImage;
    const numberOfLines = 2;
    if (this.state.issueImageSize === 'SMALL') {
      issueImage = (
        <IssueImageDisplay
          issueWeVoteId={this.state.issueWeVoteId}
          issueImageSize="SMALL"
          showPlaceholderImage
          turnOffIssueFade
        />
      );
    } else if (this.state.issueImageSize === 'MEDIUM') {
      issueImage = (
        <IssueImageDisplay
          issueWeVoteId={this.state.issueWeVoteId}
          issueImageSize="MEDIUM"
          showPlaceholderImage
          turnOffIssueFade
        />
      );
    } else if (this.state.issueImageSize === 'LARGE') {
      issueImage = (
        <IssueImageDisplay
          issueWeVoteId={this.state.issueWeVoteId}
          issueImageSize="LARGE"
          showPlaceholderImage
          turnOffIssueFade
        />
      );
    }

    return (
      <Item>
        <Wrapper
          className="card-child"
          key={`issue-card-${this.state.issueWeVoteId}`}
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
                id="valueLink"
                className="u-no-underline"
              >
                {issueDisplayName}
              </Link>
            </IssueName>
            {this.props.followToggleOn && this.state.issueWeVoteId ? (
              <div className="follow-toggle__values">
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
          </Flex>
          { this.props.turnOffDescription ?
            <Description /> :
            (
              <Description>
                <Link to={this.getIssueLink}
                      className="u-no-underline"
                >
                  <ReadMore
                    textToDisplay={issueDescription}
                    numberOfLines={numberOfLines}
                  />
                </Link>
              </Description>
            )
          }
        </Wrapper>
      </Item>
    );
  }
}

const Item = styled.div`
  width: 100%;
  padding: 0px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 50%;
  }
`;

const Wrapper = styled.div`
  display: block !important;
  padding: 12px !important;
  margin: 8px 6px !important;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 6px 72px 6px 4px !important;
    position: relative;
    height: 46px !important;
  }
`;

const IssueName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0;
  width: 100%;
  display: block !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
    position: relative;
    right: 10px;
  }
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
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export default withTheme((IssueCardCompressed));
