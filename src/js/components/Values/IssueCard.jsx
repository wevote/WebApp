import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import IssueFollowToggleButton from './IssueFollowToggleButton';
import IssueImageDisplay from './IssueImageDisplay';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
// import ReadMore from '../Widgets/ReadMore';
import { convertNameToSlug } from '../../utils/textFormat';

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

    let { issue_name: issueDisplayName } = this.state.issue;
    // let { issue_description: issueDescription, issue_name: issueDisplayName } = this.state.issue;

    issueDisplayName = issueDisplayName || '';
    // issueDescription = issueDescription || '';

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
    console.log(numberOfLines);

    return (
      <div
        className="card-main__media-object u-stack--md"
        key={`issue-card-${this.state.issueWeVoteId}`}
        style={{ border: '2px solid', borderRadius: '.25rem', borderColor: '#eee', width: '48%', height: '38px', marginBottom: '8px', marginRight: '8px' }}
      >
        <div className="card-main__media-object-anchor" style={{ padding: '3px', marginRight: '0px' }}>
          {this.props.turnOffIssueImage ? null : (
            <Link to={this.getIssueLink} className="u-no-underline">
              {issueImage}
            </Link>
          )}
        </div>
        <div className="card-main__media-object-content" style={{ alignSelf: 'center' }}>
          <Link to={this.getIssueLink} className="u-no-underline">
            <h3 className="card-main__display-name" style={{ fontSize: '10px', marginTop: '0px', marginBottom: '0px' }}>{issueDisplayName}</h3>
          </Link>
          { this.props.turnOffDescription ?
            <span className="card-main__description" /> :
            (
              <span className="card-main__description">
                <Link to={this.getIssueLink}
                      className="u-no-underline"
                >
                  {/* <ReadMore text_to_display={issueDescription}
                            num_of_lines={numberOfLines}
                  /> */}
                </Link>
              </span>
            )
          }
        </div>
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
        ) : null}
      </div>
    );
  }
}

// const CandidateInfo = styled.div`
//   display: flex;
//   flex-flow: column;
//   padding: 16px 16px 0 16px;
//   margin-bottom: 8px;
//   overflow-x: hidden;
//   transition: all 200ms ease-in;
//   border: 1px solid ${({ theme }) => theme.colors.grayBorder};
//   width: ${({ candidateLength }) => (candidateLength > 1 ? '48%' : '100%')};
//   margin-right: 8px;
//   border-radius: 4px;
//   cursor: pointer;
//   &:hover {
//     border: 1px solid ${({ theme }) => theme.colors.linkHoverBorder};
//     box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
//       0 2px 1px -1px rgba(0, 0, 0, 0.12);
//   }
//   @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
//     flex-flow: column;
//     width: 100%;
//   }
//   @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
//     flex-flow: column;
//     border: none;
//     border-bottom: 1px solid ${({ theme }) => theme.colors.grayBorder};
//     padding: 16px 0 0 0;
//     margin-bottom: 8px;
//     width: 100%;
//     &:hover {
//       border: none;
//       border-bottom: 1px solid ${({ theme }) => theme.colors.grayBorder};
//       box-shadow: none;
//     }
//   }
// `;
