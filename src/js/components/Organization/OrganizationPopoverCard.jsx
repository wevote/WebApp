import { Launch, Twitter } from '@mui/icons-material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import OrganizationActions from '../../actions/OrganizationActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import numberAbbreviate from '../../common/utils/numberAbbreviate';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import numberWithCommas from '../../common/utils/numberWithCommas';
import removeTwitterNameFromDescription from '../../common/utils/removeTwitterNameFromDescription';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import ParsedTwitterDescription from '../Twitter/ParsedTwitterDescription';

const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../Widgets/FollowToggle'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

class OrganizationPopoverCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isVoterOwner: false,
      organization: {},
    };
  }

  componentDidMount () {
    // console.log('OrganizationPopoverCard componentDidMount, this.props: ', this.props);
    this.onVoterStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    let organization = {};
    const { organizationWeVoteId } = this.props;
    if (organizationWeVoteId) {
      organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organizationWeVoteId && organizationWeVoteId !== '' && !organization.organization_we_vote_id) {
        // Retrieve the organization object
        OrganizationActions.organizationRetrieve(organizationWeVoteId);
      }
    }
    this.setState({
      organization,
      // organizationWeVoteId,
    });
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.props;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    if (voter && voter.linked_organization_we_vote_id) {
      const { organizationWeVoteId } = this.props;
      const { linked_organization_we_vote_id: linkedOrganizationWeVoteId } = voter;
      const isVoterOwner = linkedOrganizationWeVoteId === organizationWeVoteId;
      this.setState({
        isVoterOwner,
      });
    }
  }

  onEdit = () => {
    const { organizationWeVoteId } = this.props;
    historyPush(`/voterguideedit/${organizationWeVoteId}`);
  }

  render () {
    renderLog('OrganizationPopoverCard');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('OrganizationPopoverCard, organization: ', this.state.organization);
    if (!this.state.organization) {
      return <div>{LoadingWheel}</div>;
    }
    const { classes, linksOpenExternalWebsite, organizationWeVoteId } = this.props;
    const { isVoterOwner } = this.state;
    const {
      organization_twitter_handle: organizationTwitterHandle, twitter_description: twitterDescriptionRaw,
      twitter_followers_count: twitterFollowersCount,
      organization_photo_url_large: organizationPhotoUrlLarge, organization_website: organizationWebsiteRaw,
      organization_name: organizationName, organization_banner_url: organizationBannerUrl,
    } = this.state.organization;
    const organizationWebsite = organizationWebsiteRaw && organizationWebsiteRaw.slice(0, 4) !== 'http' ? `http://${organizationWebsiteRaw}` : organizationWebsiteRaw;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    const displayName = organizationName || '';
    const twitterDescription = twitterDescriptionRaw || '';
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);
    const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${organizationWeVoteId}`;
    const voterGuideLinkExternal = `https://wevote.us${voterGuideLink}`;

    return (
      <Wrapper>
        {organizationBannerUrl ? (
          <BannerImage>
            <img src={organizationBannerUrl} />
          </BannerImage>
        ) : (
          <>
            <br />
            <br />
          </>
        )}

        <Container>
          <LogoFollowToggleContainer>
            { organizationPhotoUrlLarge && (
              <span>
                {linksOpenExternalWebsite ? (
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite
                      body={(
                        <ImageContainer>
                          <img src={organizationPhotoUrlLarge} width="60" height="60" alt={`${displayName}`} />
                        </ImageContainer>
                      )}
                      className="u-no-underline"
                      linkIdAttribute="organizationPopoverCardImage"
                      url={voterGuideLinkExternal}
                      target="_blank"
                    />
                  </Suspense>
                ) : (
                  <Link
                    className="u-no-underline"
                    id="organizationPopoverCardImage"
                    to={voterGuideLink}
                  >
                    <ImageContainer>
                      <img src={organizationPhotoUrlLarge} width="60" height="60" alt={`${displayName}`} />
                    </ImageContainer>
                  </Link>
                )}
              </span>
            )}
            { isVoterOwner ? (
              <Button variant="warning" size="small" bsPrefix="pull-right" onClick={this.onEdit}>
                <span>Edit Your Endorsements</span>
              </Button>
            ) : (
              <div>
                <FollowToggleContainer>
                  <Suspense fallback={<></>}>
                    <FollowToggle organizationWeVoteId={organizationWeVoteId} />
                  </Suspense>
                </FollowToggleContainer>
              </div>
            )}
          </LogoFollowToggleContainer>
          <MainContent>
            <span>
              {linksOpenExternalWebsite ? (
                <Suspense fallback={<></>}>
                  <OpenExternalWebSite
                    linkIdAttribute="organizationPopoverCardName"
                    url={voterGuideLinkExternal}
                    target="_blank"
                    body={(
                      <OrganizationName>{displayName}</OrganizationName>
                    )}
                  />
                </Suspense>
              ) : (
                <Link
                  id="organizationPopoverCardName"
                  to={voterGuideLink}
                >
                  <OrganizationName>{displayName}</OrganizationName>
                </Link>
              )}
            </span>
            { organizationTwitterHandle && (
              <TwitterWrapper>
                <Twitter classes={{ root: classes.twitterLogo }} />
                <TwitterHandleWrapper>
                  @
                  {organizationTwitterHandle}
                </TwitterHandleWrapper>
                <span title={numberWithCommas(twitterFollowersCount)}>{numberAbbreviate(twitterFollowersCount)}</span>
              </TwitterWrapper>
            )}
            {twitterDescriptionMinusName && (
              <Description>
                <ParsedTwitterDescription
                  twitterDescription={twitterDescriptionMinusName}
                />
              </Description>
            )}
            {organizationWebsite && (
              <span className="u-wrap-links">
                <Suspense fallback={<></>}>
                  <OpenExternalWebSite
                    linkIdAttribute="organizationWebsite"
                    url={organizationWebsite}
                    target="_blank"
                    body={(
                      <span>
                        {organizationWebsite}
                        {' '}
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
              </span>
            )}
            {/* 5 of your friends follow Organization Name<br /> */}
          </MainContent>
        </Container>
      </Wrapper>
    );
  }
}
OrganizationPopoverCard.propTypes = {
  classes: PropTypes.object,
  linksOpenExternalWebsite: PropTypes.bool,
  organizationWeVoteId: PropTypes.string.isRequired,
};

const styles = () => ({
  twitterLogo: {
    color: '#1d9bf0',
    height: 18,
    marginRight: '-2px',
    marginTop: '-4px',
  },
});

const BannerImage = styled('div')`
  background: #f7f7f7;
  min-height: 90.05px !important;
  display: block;
  width: 100%;
`;

const Container = styled('div')`
  padding: 8px;
`;

const Description = styled('div')`
  margin-top: 8px;
  color: #333 !important;
  font-weight: 500 !important;
  font-size: 12px !important;
`;

const FollowToggleContainer = styled('div')`
  width: 125px;
`;

const ImageContainer = styled('div')`
  * {
    border-radius: 50px;
  }
`;

const LogoFollowToggleContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  bottom: 32px;
`;

const MainContent = styled('div')`
  margin-top: -24px;
`;

const OrganizationName = styled('h3')(({ theme }) => (`
  font-weight: bold;
  font-size: 18px;
  color: ${theme.colors.brandBlue};
  margin-bottom: 4px;
  text-decoration: none !important;
`));

const TwitterHandleWrapper = styled('span')`
  color: #000;
  margin-right: 5px;
`;

const TwitterWrapper = styled('div')`
  font-size: 13px;
  margin: 0;
  margin-top: 4px;
  white-space: nowrap;
`;

const Wrapper = styled('div')`
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  right: 12px;
  bottom: 8px;
  border-radius: 3px;
  margin-left: 12px;
  margin-top: 8px;
`;

export default withTheme(withStyles(styles)(OrganizationPopoverCard));
