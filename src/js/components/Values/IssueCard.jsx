import { Check } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import abbreviateNumber from '../../common/utils/abbreviateNumber';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { convertNameToSlug } from '../../utils/textFormat';
import IssueFollowToggleButton from './IssueFollowToggleButton';
import IssueImageDisplay from './IssueImageDisplay';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));
const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../SignIn/SignInModal'));

const NUMBER_OF_LINKED_ORGANIZATION_IMAGES_TO_SHOW = 3; // Maximum available coming from issueDescriptionsRetrieve is currently 5


class IssueCard extends Component {
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
    this.toggleShowSignInModal = this.toggleShowSignInModal.bind(this);
  }

  componentDidMount () {
    // console.log("IssueCard, componentDidMount, this.props:", this.props);
    const { issue } = this.props;
    if (issue && issue.issue_we_vote_id) {
      const { issue_we_vote_id: issueWeVoteId } = issue;
      const imageSizes = new Set(['SMALL', 'MEDIUM', 'LARGE']);
      let issueImageSize = 'SMALL'; // Set the default
      if (imageSizes.has(this.props.issueImageSize)) {
        ({ issueImageSize } = this.props);
      }
      this.setState({
        ballotItemWeVoteId: this.props.ballotItemWeVoteId,
        countOfOrganizationsUnderThisIssue: VoterGuideStore.getVoterGuidesForValue(issueWeVoteId).length,
        issue,
        issueImageSize,
        issueWeVoteId,
      });
    }
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
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

  getIssueLink () {
    const { issue } = this.state;
    if (issue && issue.issue_name) {
      const issueSlug = convertNameToSlug(issue.issue_name);
      return `/value/${issueSlug}`;
    } else {
      return '';
    }
  }

  toggleShowSignInModal () {
    const { showSignInModal } = this.state;
    this.setState({
      showSignInModal: !showSignInModal,
    });
  }

  render () {
    renderLog('IssueCard');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      currentBallotIdInUrl, followToggleOn, followToggleOnItsOwnLine,
      hideAdvocatesCount, includeLinkToIssue, turnOffDescription,
      turnOffIssueImage, urlWithoutHash,
    } = this.props;
    const {
      ballotItemWeVoteId, countOfOrganizationsUnderThisIssue,
      issue, issueImageSize, issueWeVoteId,
      showSignInModal,
    } = this.state;

    if (!issueWeVoteId) {
      return null;
    }

    const {
      issue_followers_count: issueFollowersCount,
      linked_organization_count: linkedOrganizationCount,
      linked_organization_preview_list: linkedOrganizationPreviewList,
    } = issue;
    let { issue_description: issueDescription, issue_name: issueDisplayName } = issue;

    issueDisplayName = issueDisplayName || '';
    issueDescription = issueDescription || '';

    let issueImage;
    const numberOfLines = 2;
    if (issueImageSize === 'SMALL') {
      issueImage = (
        <IssueImageDisplay
          issueWeVoteId={issueWeVoteId}
          issueImageSize="SMALL"
          showPlaceholderImage
          turnOffIssueFade
        />
      );
    } else if (issueImageSize === 'MEDIUM') {
      issueImage = (
        <IssueImageDisplay
          issueWeVoteId={issueWeVoteId}
          issueImageSize="MEDIUM"
          showPlaceholderImage
          turnOffIssueFade
        />
      );
    } else if (issueImageSize === 'LARGE') {
      issueImage = (
        <IssueImageDisplay
          issueWeVoteId={issueWeVoteId}
          issueImageSize="LARGE"
          showPlaceholderImage
          turnOffIssueFade
        />
      );
    }

    let isFirst = true;
    let organizationImageCount = 0;
    return (
      <Wrapper
        key={`issue-card-${issueWeVoteId}`}
        className={this.props.condensed ? 'card-child u-full-height' : 'card-child u-inset__h--md u-padding-top--md u-padding-bottom--md u-full-height'}
        condensed={!!this.props.condensed}
        style={isCordova() ? { margin: 'unset' } : {}}   // stops horizontal scrolling
      >
        {(showSignInModal && !VoterStore.getVoterIsSignedIn()) && (
          <Suspense fallback={<></>}>
            <SignInModal
              signInTitle="Sign in to save your values."
              signInSubTitle=""
              toggleOnClose={this.toggleShowSignInModal}
              uponSuccessfulSignIn={this.toggleShowSignInModal}
            />
          </Suspense>
        )}
        <Flex condensed={!!this.props.condensed} followToggleOnItsOwnLine={!!followToggleOnItsOwnLine}>
          <FlexNameAndIcon condensed={!!this.props.condensed}>
            <IssueImage>
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
              )}
            </IssueImage>
            <>
              {includeLinkToIssue ? (
                <Link id="valueListLink"
                      to={this.getIssueLink}
                      className="u-no-underline"
                >
                  <IssueName>
                    {`${issueDisplayName} `}
                    {!hideAdvocatesCount && (
                      <IssueAdvocatesCount>
                        {`(${countOfOrganizationsUnderThisIssue}${countOfOrganizationsUnderThisIssue === 1 ? ' Advocate' : ''}${countOfOrganizationsUnderThisIssue > 1 ? ' Advocates' : ''})`}
                      </IssueAdvocatesCount>
                    )}
                  </IssueName>
                </Link>
              ) : (
                <IssueName>
                  {`${issueDisplayName} `}
                  {!hideAdvocatesCount && (
                    <IssueAdvocatesCount>
                      {`(${countOfOrganizationsUnderThisIssue}${countOfOrganizationsUnderThisIssue === 1 ? ' Advocate' : ''}${countOfOrganizationsUnderThisIssue > 1 ? ' Advocates' : ''})`}
                    </IssueAdvocatesCount>
                  )}
                </IssueName>
              )}
            </>
          </FlexNameAndIcon>
          {(followToggleOn && issueWeVoteId) && (
            <FollowIssueToggleContainer>
              <IssueFollowToggleButton
                ballotItemWeVoteId={ballotItemWeVoteId}
                classNameOverride="pull-left"
                currentBallotIdInUrl={currentBallotIdInUrl}
                issueName={issue.issue_name}
                issueWeVoteId={issueWeVoteId}
                lightModeOn
                onIssueFollowFunction={this.toggleShowSignInModal}
                urlWithoutHash={urlWithoutHash}
              />
            </FollowIssueToggleContainer>
          )}
        </Flex>
        { !turnOffDescription && (
          <IssueCardDescription>
            <Suspense fallback={<></>}>
              <ReadMore
                textToDisplay={issueDescription}
                numberOfLines={numberOfLines}
              />
            </Suspense>
          </IssueCardDescription>
        )}
        <IssueAdvocatesAndFollowersWrapper>
          <IssueAdvocatesWrapper>
            {linkedOrganizationPreviewList && (
              <IssueAdvocatesImages>
                {linkedOrganizationPreviewList.slice(0, NUMBER_OF_LINKED_ORGANIZATION_IMAGES_TO_SHOW).map((organization) => {
                  isFirst = organizationImageCount === 0;
                  organizationImageCount += 1;
                  // console.log('organization:', organization);
                  if (organization.we_vote_hosted_profile_image_url_tiny) {
                    return (
                      <OrganizationImage
                        alt={organization.organization_name}
                        isFirst={isFirst}
                        key={`OrganizationImage-${organization.organization_we_vote_id}`}
                        organizationImageCount={organizationImageCount}
                        src={organization.we_vote_hosted_profile_image_url_tiny}
                        title={organization.organization_name}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
              </IssueAdvocatesImages>
            )}
            {linkedOrganizationCount && (
              <LinkedOrganizationCountWrapper>
                {abbreviateNumber(linkedOrganizationCount)}
                <CheckWrapper>
                  <Check />
                </CheckWrapper>
              </LinkedOrganizationCountWrapper>
            )}
          </IssueAdvocatesWrapper>
          <FollowersWrapper>
            {issueFollowersCount && (
              <>
                {abbreviateNumber(issueFollowersCount)}
                {' '}
                followers
              </>
            )}
          </FollowersWrapper>
        </IssueAdvocatesAndFollowersWrapper>
      </Wrapper>
    );
  }
}
IssueCard.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  currentBallotIdInUrl: PropTypes.string,
  followToggleOn: PropTypes.bool,
  followToggleOnItsOwnLine: PropTypes.bool,
  hideAdvocatesCount: PropTypes.bool,
  includeLinkToIssue: PropTypes.bool,
  issue: PropTypes.object.isRequired,
  issueImageSize: PropTypes.string,
  turnOffDescription: PropTypes.bool,
  turnOffIssueImage: PropTypes.bool,
  urlWithoutHash: PropTypes.string,
  condensed: PropTypes.bool,
};

const CheckWrapper = styled('div')`
  color: #999;
  margin-top: -4px;
`;

const Wrapper = styled('div', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  display: block !important;
  background: white;
  // border: ${condensed ? '1px solid #888' : 'none'};
  // box-shadow: ${condensed ? 'none !important' : ''};
  padding: ${condensed ? '0 0' : ''};
  height: ${condensed ? 'fit-content' : ''};
  @media (max-width: 479px) {
    margin: 0 -16px;
  }
`));

const FollowersWrapper = styled('div')`
  color: #999;
  font-size: 14px;
`;

const IssueName = styled('h3')`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0;
`;

const IssueAdvocatesCount = styled('span')`
  font-weight: normal;
  white-space: nowrap;
`;

const IssueAdvocatesAndFollowersWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const IssueAdvocatesImages = styled('div')`
  align-items: center;
  display: flex;
  justify-content: start;
  margin-right: 2px;
`;

const IssueAdvocatesWrapper = styled('div')`
  align-items: center;
  color: #999;
  display: flex;
  font-size: 14px;
  justify-content: flex-start;
`;

const FollowIssueToggleContainer = styled('div')`
  margin-left: auto;
`;

const Flex = styled('div', {
  shouldForwardProp: (prop) => !['condensed', 'followToggleOnItsOwnLine'].includes(prop),
})(({ condensed, followToggleOnItsOwnLine }) => (`
  ${followToggleOnItsOwnLine ?
    '' :
    'display: flex; align-items: center; justify-content: flex-start;'
  }
  width: ${condensed ? '100%' : null};
`));

const FlexNameAndIcon = styled('div', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: ${condensed ? '100%' : null};
`));

const IssueCardDescription = styled('div')`
  margin-top: 8px;
  color: #333;
`;

const IssueImage = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-right: 10px;
`;

const LinkedOrganizationCountWrapper = styled('div')`
  display: flex;
  justify-content: start;
  margin-top: 4px;
`;

const OrganizationImage = styled('img', {
  shouldForwardProp: (prop) => !['isFirst', 'organizationImageCount'].includes(prop),
})(({ isFirst, organizationImageCount }) => (`
  border: 2px solid #fff;
  border-radius: 16px;
  height: 32px;
  margin-top: 3px;
  ${!isFirst ? 'margin-left: -8px;' : ''}
  width: 32px;
  z-index: ${200 - organizationImageCount};
`));

export default IssueCard;
