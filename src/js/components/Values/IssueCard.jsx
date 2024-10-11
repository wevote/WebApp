import { Check } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import numberAbbreviate from '../../common/utils/numberAbbreviate';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import Cookies from '../../common/utils/js-cookie/Cookies';
import { renderLog } from '../../common/utils/logging';
import IssueStore from '../../stores/IssueStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { convertNameToSlug, convertToInteger } from '../../common/utils/textFormat';
import IssueFollowToggleButton from './IssueFollowToggleButton';
import IssueImageDisplay from './IssueImageDisplay';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));
const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../../common/components/SignIn/SignInModal'));

const NUMBER_OF_LINKED_ORGANIZATION_IMAGES_TO_SHOW = 3; // Maximum available coming from issueDescriptionsRetrieve is currently 5
const NUMBER_OF_LINKED_ORGANIZATION_NAMES_TO_SHOW = 10;
const NUMBER_OF_TOPIC_CHOICES_ALLOWED_BEFORE_SHOW_MODAL = 3;

class IssueCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotItemWeVoteId: '',
      countOfVoterGuidesUnderThisIssue: 0,
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
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onIssueStoreChange.bind(this));
    if (issue && issue.issue_we_vote_id) {
      const { issue_we_vote_id: issueWeVoteId } = issue;
      const imageSizes = new Set(['SMALL', 'MEDIUM', 'LARGE']);
      let issueImageSize = 'SMALL'; // Set the default
      if (imageSizes.has(this.props.issueImageSize)) {
        ({ issueImageSize } = this.props);
      }
      this.setState({
        ballotItemWeVoteId: this.props.ballotItemWeVoteId,
        countOfVoterGuidesUnderThisIssue: VoterGuideStore.getVoterGuidesForValue(issueWeVoteId).length,
        issue,
        issueImageSize,
        issueWeVoteId,
      }, () => this.onIssueStoreChange());
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
        countOfVoterGuidesUnderThisIssue: VoterGuideStore.getVoterGuidesForValue(issueWeVoteId).length,
        issue: nextProps.issue,
        issueImageSize,
        issueWeVoteId,
      }, () => this.onIssueStoreChange());
    }
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    const { issue } = this.props;
    const {
      issue_followers_count: issueFollowersCount,
      issue_we_vote_id: issueWeVoteId,
      linked_organization_count: linkedOrganizationCount,
      linked_organization_preview_list: linkedOrganizationPreviewList,
    } = issue;

    this.setState({
      issueFollowersCount,
      issueWeVoteId,
      linkedOrganizationPreviewList,
      linkedOrganizationCount,
    }, () => this.onVoterGuideStoreChange());
  }

  onVoterGuideStoreChange () {
    const { issueWeVoteId } = this.state;
    this.setState({
      countOfVoterGuidesUnderThisIssue: VoterGuideStore.getVoterGuidesForValue(issueWeVoteId).length,
    });
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

  onIssueFollowClick = () => {
    const signInOpenedFromPreviousIssueFollow = Cookies.get('sign_in_opened_from_issue_follow') || 0;
    // const signInOpenedFromPreviousIssueFollow = false; // For testing
    let numberOfTopicChoicesMade = convertToInteger(Cookies.get('number_of_topic_choices_made')) || 0;
    numberOfTopicChoicesMade += 1;
    // console.log('numberOfTopicChoicesMade', numberOfTopicChoicesMade);
    Cookies.set('number_of_topic_choices_made', numberOfTopicChoicesMade, { expires: 1, path: '/' });
    if (!signInOpenedFromPreviousIssueFollow && numberOfTopicChoicesMade >= NUMBER_OF_TOPIC_CHOICES_ALLOWED_BEFORE_SHOW_MODAL) {
      Cookies.set('sign_in_opened_from_issue_follow', '1', { expires: 1, path: '/' });
      this.toggleShowSignInModal();
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
      advocatesCount: incomingAdvocatesCount,
      currentBallotIdInUrl, followToggleOn, followToggleOnItsOwnLine,
      hideAdvocatesCount, includeLinkToIssue, turnOffDescription,
      turnOffIssueImage, urlWithoutHash,
    } = this.props;
    const {
      ballotItemWeVoteId, countOfVoterGuidesUnderThisIssue,
      issue, issueFollowersCount, issueImageSize, issueWeVoteId,
      linkedOrganizationCount, linkedOrganizationPreviewList,
      showSignInModal,
    } = this.state;

    if (!issueWeVoteId) {
      return null;
    }

    let { issue_description: issueDescription, issue_name: issueDisplayName } = issue;

    issueDisplayName = issueDisplayName || '';
    issueDescription = issueDescription || '';

    const advocatesCount = incomingAdvocatesCount || countOfVoterGuidesUnderThisIssue;
    let issueImage;
    const numberOfLines = 5;
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

    const issueTooltip = isMobileScreenSize() ? (<span />) : (
      <Tooltip className="u-z-index-9020" id="issueTooltip">
        <div>
          Follow
          {' '}
          {issueDisplayName}
          {' '}
          to improve your personalized score, up-and-down your ballot.
        </div>
      </Tooltip>
    );
    let linkedOrganizationsTooltip = <></>;
    let linkedOrganizationNameCount = 0;
    if (linkedOrganizationPreviewList) {
      linkedOrganizationsTooltip = isMobileScreenSize() ? (<span />) : (
        <Tooltip className="u-z-index-9020" id="linkedOrganizationsTooltip">
          <div>
            See endorsements from
            {linkedOrganizationCount ? (
              <>
                {' '}
                {linkedOrganizationCount}
                {' '}
                advocates, like:
              </>
            ) : (
              <>
                :
              </>
            )}

            <br />
            {linkedOrganizationPreviewList.map((linkedOrganization) => {
              // console.log('linkedOrganization:', linkedOrganization);
              if (linkedOrganization.organization_name) {
                linkedOrganizationNameCount += 1;
                if (linkedOrganizationNameCount <= NUMBER_OF_LINKED_ORGANIZATION_NAMES_TO_SHOW) {
                  return (
                    <OneOrganizationName
                      key={`LinkedOrganizationName-${linkedOrganization.organization_we_vote_id}-${linkedOrganizationNameCount}`}
                    >
                      {linkedOrganization.organization_name}
                      <br />
                    </OneOrganizationName>
                  );
                } else {
                  return null;
                }
              } else {
                return null;
              }
            })}
          </div>
        </Tooltip>
      );
    }

    const followersTooltip = isMobileScreenSize() ? (<span />) : (
      <Tooltip className="u-z-index-9020" id="followersTooltip">
        <div>
          {numberAbbreviate(issueFollowersCount)}
          {' '}
          people have followed
          {' '}
          <span className="u-no-break">{issueDisplayName}</span>
          {' '}
          <span className="u-no-break">on WeVote</span>
        </div>
      </Tooltip>
    );

    const issueNameAndCount = (
      <IssueName>
        {`${issueDisplayName} `}
        {!hideAdvocatesCount && (
          <IssueAdvocatesCount>
            {`(${advocatesCount}${advocatesCount === 1 ? ' Advocate' : ''}${advocatesCount > 1 ? ' Advocates' : ''})`}
          </IssueAdvocatesCount>
        )}
      </IssueName>
    );
    let isFirst = true;
    let organizationImageCount = 0;

    const issueAdvocates = (
      <IssueAdvocatesWrapper>
        {!!(linkedOrganizationPreviewList) && (
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
        {!!(linkedOrganizationCount) && (
          <LinkedOrganizationCountWrapper>
            {numberAbbreviate(linkedOrganizationCount)}
            <CheckWrapper>
              <Check />
            </CheckWrapper>
          </LinkedOrganizationCountWrapper>
        )}
      </IssueAdvocatesWrapper>
    );

    // console.log('OverlayTrigger debugging issueTooltip: ', issueTooltip);

    return (
      <IssueCardWrapper
        key={`issue-card-${issueWeVoteId}`}
        className={this.props.condensed ? 'u-full-height' : 'u-inset__h--md u-padding-top--md u-padding-bottom--md u-full-height'}
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
          <OverlayTrigger overlay={issueTooltip} placement={includeLinkToIssue ? 'top' : 'bottom'}>
            <span>
              <FlexNameAndIcon condensed={!!this.props.condensed}>
                <IssueImage>
                  {!turnOffIssueImage && (
                    <span>
                      {includeLinkToIssue ? (
                        <Link to={this.getIssueLink}
                              className="u-no-underline"
                              tabIndex={-1}
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
                          className="u-link-color"
                    >
                      {issueNameAndCount}
                    </Link>
                  ) : (
                    <>
                      {issueNameAndCount}
                    </>
                  )}
                </>
              </FlexNameAndIcon>
            </span>
          </OverlayTrigger>
          {(followToggleOn && issueWeVoteId) && (
            <FollowIssueCardToggleContainer>
              <IssueFollowToggleButton
                ballotItemWeVoteId={ballotItemWeVoteId}
                classNameOverride="pull-left"
                currentBallotIdInUrl={currentBallotIdInUrl}
                issueName={issue.issue_name}
                issueWeVoteId={issueWeVoteId}
                lightModeOn
                onIssueFollowFunction={this.onIssueFollowClick}
                urlWithoutHash={urlWithoutHash}
              />
            </FollowIssueCardToggleContainer>
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
          <OverlayTrigger overlay={linkedOrganizationsTooltip} placement="top">
            <span>
              {includeLinkToIssue ? (
                <Link id="issueAdvocatesLink"
                      to={this.getIssueLink}
                >
                  {issueAdvocates}
                </Link>
              ) : (
                <>
                  {issueAdvocates}
                </>
              )}
            </span>
          </OverlayTrigger>
          <OverlayTrigger overlay={followersTooltip} placement="top">
            <span>
              <FollowersWrapper>
                {!!(issueFollowersCount) && (
                  <>
                    {numberAbbreviate(issueFollowersCount)}
                    {' '}
                    followers
                  </>
                )}
              </FollowersWrapper>
            </span>
          </OverlayTrigger>
        </IssueAdvocatesAndFollowersWrapper>
      </IssueCardWrapper>
    );
  }
}
IssueCard.propTypes = {
  advocatesCount: PropTypes.number,
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

const IssueCardWrapper = styled('div', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  display: block !important;
  background: white;
  // border: ${condensed ? '1px solid #888' : 'none'};
  // box-shadow: ${condensed ? 'none !important' : ''};
  padding: ${condensed ? '0 0' : ''};
  height: ${condensed ? 'fit-content' : ''};
  // @media (max-width: 479px) {
  //   margin: 0 -16px;
  // }
`));

const FollowersWrapper = styled('div')`
  color: #5E5E5B;
  font-size: 14px;
`;

const IssueName = styled('h3')`
  font-size: 18px;
  font-weight: 500;
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
  color: #5E5E5B;
  display: flex;
  font-size: 14px;
  justify-content: flex-start;
`;

const FollowIssueCardToggleContainer = styled('div')`
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
  line-height: 115%;
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

const OneOrganizationName = styled('span')`
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
