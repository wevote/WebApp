import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import styled from 'styled-components';
import FollowToggle from '../Widgets/FollowToggle';
import LoadingWheel from '../LoadingWheel';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import OrganizationStore from '../../stores/OrganizationStore';
import OrganizationActions from '../../actions/OrganizationActions';
import ParsedTwitterDescription from '../Twitter/ParsedTwitterDescription';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';
import { numberWithCommas, removeTwitterNameFromDescription } from '../../utils/textFormat';


class OrganizationPopoverCard extends Component {
  static propTypes = {
    organizationWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      isVoterOwner: false,
      organization: {},
      organizationWeVoteId: '',
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
      organizationWeVoteId,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if onOrganizationStoreChange didn't see any changes
    let organizationWeVoteId = '';
    if (this.state.organization) {
      ({ organization_we_vote_id: organizationWeVoteId } = this.state.organization);
    }
    let nextOrganizationWeVoteId = '';
    if (nextState.organization) {
      ({ organization_we_vote_id: nextOrganizationWeVoteId } = nextState.organization);
    }
    if (organizationWeVoteId !== nextOrganizationWeVoteId) {
      return true;
    }
    if (this.state.isVoterOwner !== nextState.isVoterOwner) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    if (voter && voter.linked_organization_we_vote_id) {
      const { organizationWeVoteId } = this.state;
      const { linked_organization_we_vote_id: linkedOrganizationWeVoteId } = voter;
      const isVoterOwner = linkedOrganizationWeVoteId === organizationWeVoteId;
      this.setState({
        isVoterOwner,
      });
    }
  }

  render () {
    // console.log('OrganizationPopoverCard render');
    renderLog(__filename);
    if (!this.state.organization) {
      return <div>{LoadingWheel}</div>;
    }

    // console.log('OrganizationPopoverCard, organization: ', this.state.organization);

    const {
      organization_twitter_handle: organizationTwitterHandle, twitter_description: twitterDescriptionRaw,
      twitter_followers_count: twitterFollowersCount,
      organization_photo_url_large: organizationPhotoUrlLarge, organization_website: organizationWebsiteRaw,
      organization_name: organizationName, organization_we_vote_id: organizationWeVoteId, organization_banner_url: organizationBannerUrl,
    } = this.state.organization;
    const organizationWebsite = organizationWebsiteRaw && organizationWebsiteRaw.slice(0, 4) !== 'http' ? `http://${organizationWebsiteRaw}` : organizationWebsiteRaw;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    const displayName = organizationName || '';
    const twitterDescription = twitterDescriptionRaw || '';
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);
    const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${organizationWeVoteId}`;

    return (
      <Wrapper>
        {organizationBannerUrl && (
          // <BannerImage>
          <img src={organizationBannerUrl} />
          // </BannerImage>
        )}
        <Container>
          <LogoFollowToggleContainer>
            { organizationPhotoUrlLarge && (
              <Link
                id="organizationPopoverCardImage"
                to={voterGuideLink}
                className="u-no-underline"
              >
                <ImageContainer>
                  <img src={organizationPhotoUrlLarge} width="60" height="60" alt={`${displayName}`} />
                </ImageContainer>
              </Link>
            )}
            { this.state.isVoterOwner ? (
              <Button variant="warning" size="small" bsPrefix="pull-right" onClick={this.onEdit}>
                <span>Edit Your Voter Guide</span>
              </Button>
            ) : (
              <div>
                <FollowToggleContainer>
                  <FollowToggle organizationWeVoteId={organizationWeVoteId} />
                </FollowToggleContainer>
              </div>
            )}
          </LogoFollowToggleContainer>
          <MainContent>
            <Link
              id="organizationPopoverCardName"
              to={voterGuideLink}
            >
              <OrganizationName>{displayName}</OrganizationName>
            </Link>
            { organizationTwitterHandle && (
              <OrganizationTwitterHandle>
                @
                {organizationTwitterHandle}
                &nbsp;&nbsp;
                { twitterFollowersCount && (
                  <span>
                    <span className="fab fa-twitter twitter-followers__icon" />
                    {numberWithCommas(twitterFollowersCount)}
                  </span>
                )}
              </OrganizationTwitterHandle>
            )}
            { twitterDescriptionMinusName && (
              <Description>
                <ParsedTwitterDescription
                  twitter_description={twitterDescriptionMinusName}
                />
              </Description>
            )
            }
            { organizationWebsite && (
              <span className="u-wrap-links">
                <OpenExternalWebSite
                  url={organizationWebsite}
                  target="_blank"
                  body={(
                    <span>
                      {organizationWebsite}
                      {' '}
                      <i className="fas fa-external-link-alt" />
                    </span>
                  )}
                />
              </span>
            )}
            {/* 5 of your friends follow Organization Name<br /> */}
          </MainContent>
        </Container>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  overflow-x: hidden;
  width: calc(100% + 24px);
  height: calc(100% + 16px);
  position: relative;
  right: 12px;
  bottom: 8px;
  border-radius: 3px;
`;

const Container = styled.div`
  padding: 0 8px;
`;

const LogoFollowToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  bottom: 32px;
`;

const ImageContainer = styled.div`
  * {
    border-radius: 50px;
  }
`;

const FollowToggleContainer = styled.div`
  width: 125px;
`;

const MainContent = styled.div`
  margin-top: -24px;
`;

const OrganizationName = styled.h3`
  font-weight: bold;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.brandBlue};
  margin-bottom: 4px;
  text-decoration: none !important;
`;

const OrganizationTwitterHandle = styled.div`
  font-weight: 500;
  font-size: 14px;
  margin: 0;
  padding: 0;
  color: #ccc;
`;

const Description = styled.div`
  margin-top: 8px;
  color: #333 !important;
  font-weight: 500 !important;
  font-size: 12px !important;
`;

export default OrganizationPopoverCard;
