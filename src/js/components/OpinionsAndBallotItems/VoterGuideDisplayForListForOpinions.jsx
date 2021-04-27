import { Button, Card } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AppActions from '../../actions/AppActions';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { isSpeakerTypeIndividual, isSpeakerTypeOrganization } from '../../utils/organization-functions';
import { numberWithCommas } from '../../utils/textFormat';
import ImageHandler from '../ImageHandler';

const { ReactSVG } = React.lazy(() => import('react-svg'));
const FollowToggle = React.lazy(() => import('../Widgets/FollowToggle'));
const IssuesByOrganizationDisplayList = React.lazy(() => import('../Values/IssuesByOrganizationDisplayList'));
const OrganizationPopoverCard = React.lazy(() => import('../Organization/OrganizationPopoverCard'));
const ReadMore = React.lazy(() => import('../Widgets/ReadMore'));
const StickyPopover = React.lazy(() => import('../Ballot/StickyPopover'));

class voterGuideDisplayForListForOpinions extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onOrganizationInVotersNetworkChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  onFriendStoreChange () {
    // We want to re-render so issue data can update
    this.onOrganizationInVotersNetworkChange();
  }

  onIssueStoreChange () {
    // We want to re-render so issue data can update
    this.onOrganizationInVotersNetworkChange();
  }

  onOrganizationStoreChange () {
    // We want to re-render so issue data can update
    this.onOrganizationInVotersNetworkChange();
  }

  onOrganizationInVotersNetworkChange () {
    const { organizationWeVoteId } = this.props;
    const voterIsFriendsWithThisOrganization = FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId);
    // let voterWeVoteIdForThisOrganization = '';
    // if (voterIsFriendsWithThisOrganization && position.voter_we_vote_id) {
    //   voterWeVoteIdForThisOrganization = position.voter_we_vote_id;
    // }
    // console.log('voterIsFriendsWithThisOrganization:', voterIsFriendsWithThisOrganization);
    // console.log('voterWeVoteIdForThisOrganization:', voterWeVoteIdForThisOrganization);
    this.setState({
      voterIsFriendsWithThisOrganization,
    });
  }

  closeOrganizationModal () {
    AppActions.setShowOrganizationModal(false);
  }

  render () {
    renderLog('voterGuideDisplayForListForOpinions');  // Set LOG_RENDER_EVENTS to log all renders
    const { organizationWeVoteId } = this.props;
    const {
      classes, searchResultsNode, twitterDescription, twitterFollowersCount,
      twitterHandle, voterGuideDisplayName, voterGuideImageUrlMedium,
      voterGuideOwnerType,
    } = this.props;
    const { voterIsFriendsWithThisOrganization } = this.state;
    // console.log('voterGuideDisplayForListForOpinions render voterGuide:', voterGuide, ', organizationWeVoteId:', organizationWeVoteId);

    if (!organizationWeVoteId || !voterGuideDisplayName) {
      return null;
    }

    // TwitterHandle-based link
    const voterGuideWeVoteIdLink = `/voterguide/${organizationWeVoteId}`;
    const speakerLink = twitterHandle ? `/${twitterHandle}` : voterGuideWeVoteIdLink;

    let imagePlaceholder = '';
    if (isSpeakerTypeOrganization(voterGuideOwnerType)) {
      imagePlaceholder = (
        <ReactSVG
          src={cordovaDot('/img/global/svg-icons/organization-icon.svg')}
        />
      );
    } else if (isSpeakerTypeIndividual(voterGuideOwnerType)) {
      imagePlaceholder = (
        <ReactSVG
          src={cordovaDot('/img/global/svg-icons/avatar-generic.svg')}
        />
      );
    }

    const voterGuideDescription = twitterDescription && (
      <ReadMore
        numberOfLines={3}
        textToDisplay={twitterDescription}
      />
    );

    const organizationPopoverCard = organizationWeVoteId ? <OrganizationPopoverCard organizationWeVoteId={organizationWeVoteId} /> : <span />;

    return (
      <Card className="card">
        <div className="u-show-desktop-tablet">
          {searchResultsNode}
          <DesktopContainer>
            <DesktopItemLeft>
              <DesktopItemImage>
                <StickyPopover
                  delay={{ show: 700, hide: 100 }}
                  popoverComponent={organizationPopoverCard}
                  placement="auto"
                  id="positions-organization-popover-trigger-click-root-close"
                >
                  <div>
                    <Link
                      to={speakerLink}
                      className="u-no-underline"
                    >
                      { voterGuideImageUrlMedium ? (
                        <ImageHandler
                          className="card-child__avatar"
                          sizeClassName="icon-lg"
                          imageUrl={voterGuideImageUrlMedium}
                        />
                      ) :
                        imagePlaceholder }
                    </Link>
                  </div>
                </StickyPopover>
              </DesktopItemImage>
              {voterIsFriendsWithThisOrganization  ? (
                <>
                  <Button
                    variant="outlined"
                    classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
                    color="primary"
                    disabled
                  >
                    Friend
                  </Button>
                  {/* We don't want to make it too easy to remove friend
                  voterWeVoteIdForThisOrganization && <FriendToggle otherVoterWeVoteId={voterWeVoteIdForThisOrganization} /> */}
                </>
              ) : (
                <FollowToggle organizationWeVoteId={organizationWeVoteId} lightModeOn hideDropdownButtonUntilFollowing anchorLeft platformType="desktop" />
              )}
            </DesktopItemLeft>
            <VoterGuideDesktop>
              <DesktopItemHeader>
                <DesktopItemNameIssueContainer>
                  <DesktopItemNameContainer>
                    <DesktopItemName>
                      <StickyPopover
                        delay={{ show: 700, hide: 100 }}
                        popoverComponent={organizationPopoverCard}
                        placement="auto"
                        id="positions-popover-trigger-click-root-close"
                      >
                        <div>
                          <Link
                            id={`desktop-LinkToEndorsingOrganization-${organizationWeVoteId}`}
                            onClick={this.closeOrganizationModal}
                            to={speakerLink}
                          >
                            { voterGuideDisplayName }
                          </Link>
                        </div>
                      </StickyPopover>
                    </DesktopItemName>
                    <DesktopItemTwitterContainer>
                      { !!(twitterFollowersCount && String(twitterFollowersCount) !== '0') && (
                        <DesktopItemTwitter>
                          <TwitterIcon className="fab fa-twitter" />
                          {numberWithCommas(twitterFollowersCount)}
                        </DesktopItemTwitter>
                      )}
                    </DesktopItemTwitterContainer>
                  </DesktopItemNameContainer>
                  <DesktopItemIssues>
                    <IssuesByOrganizationDisplayList
                      organizationWeVoteId={organizationWeVoteId}
                      placement="auto"
                    />
                  </DesktopItemIssues>
                </DesktopItemNameIssueContainer>
              </DesktopItemHeader>
              <DesktopItemBody>
                <DesktopItemDescription>
                  {voterGuideDescription}
                </DesktopItemDescription>
                <DesktopItemFooter>
                  {/* <strong>Was this Useful?</strong>
                  Yes  No
                  <div className="u-float-right">
                    Flag Links
                  </div> */}
                  {speakerLink && (
                    <SourceLink className="u-gray-mid">
                      <Link to={speakerLink}>
                        view more
                      </Link>
                    </SourceLink>
                  )}
                </DesktopItemFooter>
              </DesktopItemBody>
            </VoterGuideDesktop>
          </DesktopContainer>
        </div>
        <div className="u-show-mobile">
          {searchResultsNode}
          <VoterGuideMobile>
            <MobileItemHeader>
              <MobileItemImage>
                <Link to={speakerLink} className="u-no-underline">
                  { voterGuideImageUrlMedium ? (
                    <ImageHandler
                      className="card-child__avatar"
                      sizeClassName="icon-lg"
                      imageUrl={voterGuideImageUrlMedium}
                    />
                  ) :
                    imagePlaceholder }
                </Link>
              </MobileItemImage>
              {/* Visible for most phones */}
              <MobileItemNameIssuesContainer>
                <MobileItemName>
                  <Link
                    className="u-break-word"
                    id={`mobile-LinkToEndorsingOrganization-${organizationWeVoteId}`}
                    onClick={this.closeOrganizationModal}
                    to={speakerLink}
                  >
                    { voterGuideDisplayName }
                  </Link>
                </MobileItemName>
                <MobileItemIssues>
                  <IssuesByOrganizationDisplayList
                    organizationWeVoteId={organizationWeVoteId}
                    placement="bottom"
                    fullWidth
                  />
                </MobileItemIssues>
              </MobileItemNameIssuesContainer>
              {/* Visible on iPhone 5/se */}
              <MobileSmallItemNameContainer>
                <MobileItemName>
                  <Link to={speakerLink} className="u-break-word">
                    { voterGuideDisplayName }
                  </Link>
                </MobileItemName>
              </MobileSmallItemNameContainer>
            </MobileItemHeader>
            <MobileSmallItemIssuesContainer>
              <MobileItemIssues>
                <IssuesByOrganizationDisplayList
                  organizationWeVoteId={organizationWeVoteId}
                  placement="bottom"
                  fullWidth
                />
              </MobileItemIssues>
            </MobileSmallItemIssuesContainer>
            <MobileItemBody>
              <MobileItemDescriptionFollowToggleContainer>
                <MobileItemDescription>
                  {voterGuideDescription}
                </MobileItemDescription>
                <MobileItemFollowToggleDisplay>
                  {voterIsFriendsWithThisOrganization  ? (
                    <>
                      <Button
                        variant="outlined"
                        classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
                        color="primary"
                        disabled
                      >
                        Friend
                      </Button>
                      {/* We don't want to make it too easy to remove friend
                      voterWeVoteIdForThisOrganization && <FriendToggle otherVoterWeVoteId={voterWeVoteIdForThisOrganization} /> */}
                    </>
                  ) : (
                    <FollowToggle organizationWeVoteId={organizationWeVoteId} lightModeOn hideDropdownButtonUntilFollowing platformType="mobile" />
                  )}
                </MobileItemFollowToggleDisplay>
              </MobileItemDescriptionFollowToggleContainer>
              <MobileItemFooter>
                {/* <strong>Was this Useful?</strong>
                Yes  No
                <div className="u-float-right">
                  Flag Links
                </div> */}
                {speakerLink && (
                  <SourceLink className="u-gray-mid">
                    <Link to={speakerLink}>
                      view more
                    </Link>
                  </SourceLink>
                )}
              </MobileItemFooter>
            </MobileItemBody>
          </VoterGuideMobile>
        </div>
      </Card>
    );
  }
}
voterGuideDisplayForListForOpinions.propTypes = {
  classes: PropTypes.object,
  organizationWeVoteId: PropTypes.string,
  searchResultsNode: PropTypes.object,
  twitterDescription: PropTypes.string,
  twitterFollowersCount: PropTypes.number,
  twitterHandle: PropTypes.string,
  voterGuideDisplayName: PropTypes.string,
  voterGuideImageUrlMedium: PropTypes.string,
  voterGuideOwnerType: PropTypes.string,
};

const styles = (theme) => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
});

const DesktopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 24px;
`;

const DesktopItemBody = styled.div`
  margin: 0;
`;

const DesktopItemDescription = styled.div`
  font-size: 14px;
  margin-top: 8px;
`;

const DesktopItemFooter = styled.div`
  font-size: 12px;
  margin-top: 2px;
`;

const DesktopItemHeader = styled.div`
  display: flex;
  align-items: top;
  justify-content: flex-start;
`;

const DesktopItemImage = styled.div`
  width: 57.76px;
  margin: 0 auto;
  height: 57.76px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 8px;
  * {
    border-radius: 6px;
    width: 57.76px !important;
    height: 57.76px !important;
    max-width: 57.76px !important;
    display: flex;
    align-items: flex-start;
  }
`;

const DesktopItemIssues = styled.div`
  margin: 0;
  padding: 0;
`;

const DesktopItemLeft = styled.div`
  width: 85px;
  padding: 0 16px 0 0;
`;

const DesktopItemName = styled.h4`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const DesktopItemNameContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const DesktopItemNameIssueContainer = styled.div`
  padding: 0px;
`;

const DesktopItemTwitter = styled.div`
  color: #999;
  display: inline-block;
  font-size: 12px;
  padding-left: 10px;
  white-space: nowrap;
`;

const DesktopItemTwitterContainer = styled.div`
`;

const MobileItemBody = styled.div`
  padding: 6px 6px 6px;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 5px;
`;

const MobileItemDescription = styled.div`
  font-size: 16px;
  color: #333;
  flex: 1 1 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
  }
`;

const MobileItemDescriptionFollowToggleContainer = styled.div`
  left: 2px;
  display: flex;
  justify-content: space-between;
`;

const MobileItemFollowToggleDisplay = styled.div`
  width: 75px;
`;

const MobileItemFooter = styled.div`
  height: 20px;
  width: 100%;
  margin-top: 2px;
  font-size: 12px;
`;

const MobileItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 6px 0 6px 8px;
  min-height: 46px;
`;

const MobileItemImage = styled.div`
  margin-right: 16px;
  width: 40px;
  height: 40px;
  * {
    border-radius: 4px;
    width: 40px !important;
    height: 40px !important;
    max-width: 40px !important;
    display: flex;
    align-items: flex-start;
    &::before {
      font-size: 40px !important;
    }
  }
`;

const MobileItemIssues = styled.div`
  margin: 0;
  font-size: 14px;
  flex: 1 1 0;
`;

const MobileItemName = styled.h4`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const MobileItemNameIssuesContainer = styled.div`
  display: block;
  @media (max-width: 374px) {
    display: none;
  }
`;

const MobileSmallItemIssuesContainer = styled.div`
  @media (min-width: 375px) {
    display: none;
  }
  width: 100%;
  margin-top: -12px;
`;

const MobileSmallItemNameContainer = styled.div`
  @media (min-width: 375px) {
    display: none;
  }
`;

const VoterGuideDesktop = styled.div`
  background: #eee;
  ${({ isSupport, isOppose }) => ((!isOppose && !isSupport) ? 'border-left: 4px solid #ccc;' : '')}
  ${({ isOppose }) => (isOppose ? 'border-left: 4px solid rgb(255, 73, 34);' : '')}
  ${({ isSupport }) => (isSupport ? 'border-left: 4px solid rgb(31, 192, 111);' : '')}
  border-radius: 5px;
  flex: 1 1 0;
  list-style: none;
  padding: 6px 16px;
`;

const VoterGuideMobile = styled.li`
  background: #fff;
  ${({ isSupport, isOppose }) => ((!isOppose && !isSupport) ? 'border-left: 4px solid #ccc;' : '')}
  ${({ isOppose }) => (isOppose ? 'border-left: 4px solid rgb(255, 73, 34);' : '')}
  ${({ isSupport }) => (isSupport ? 'border-left: 4px solid rgb(31, 192, 111);' : '')}
  border-radius: 5px;
  list-style: none;
  margin: 0 !important;
  max-width: 100% !important;
`;

const SourceLink = styled.div`
  float: right;
  margin-bottom: -4px;
`;

const TwitterIcon = styled.span`
  font-size: 16px;
  color: #ccc;
  margin-right: 2px;
  vertical-align: bottom;
`;

export default withTheme(withStyles(styles)(voterGuideDisplayForListForOpinions));
