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
import { removeTwitterNameFromDescription } from '../../utils/textFormat';


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

    const {
      organization_twitter_handle: organizationTwitterHandle, twitter_description: twitterDescriptionRaw,
      organization_photo_url_large: organizationPhotoUrlLarge, organization_website: organizationWebsiteRaw,
      organization_name: organizationName, organization_we_vote_id: organizationWeVoteId,
    } = this.state.organization; // , twitter_followers_count
    const organizationWebsite = organizationWebsiteRaw && organizationWebsiteRaw.slice(0, 4) !== 'http' ? `http://${organizationWebsiteRaw}` : organizationWebsiteRaw;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    const displayName = organizationName || '';
    const twitterDescription = twitterDescriptionRaw || '';
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);
    const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${organizationWeVoteId}`;

    return (
      <Wrapper>
        { organizationPhotoUrlLarge ? (
          <Link to={voterGuideLink} className="u-no-underline">
            <img src={organizationPhotoUrlLarge} height="180" />
          </Link>
        ) : null
        }
        <br />
        <Link to={voterGuideLink}>
          <h3 className="card-main__display-name">{displayName}</h3>
        </Link>
        { organizationTwitterHandle ? (
          <span>
            @
            {organizationTwitterHandle}
            &nbsp;&nbsp;
          </span>
        ) :
          null
        }
        <br />
        { this.state.isVoterOwner ? (
          <Button variant="warning" size="small" bsPrefix="pull-right" onClick={this.onEdit}>
            <span>Edit Your Voter Guide</span>
          </Button>
        ) :
          <FollowToggle organizationWeVoteId={organizationWeVoteId} showFollowingText />
        }
        { twitterDescriptionMinusName && (
          <ParsedTwitterDescription
            twitter_description={twitterDescriptionMinusName}
          />
        )
        }

        { organizationWebsite ? (
          <span className="u-wrap-links">
            <OpenExternalWebSite
              url={organizationWebsite}
              target="_blank"
              body={(
                <span>
                  {organizationWebsite}
                  {' '}
                  <i className="fa fa-external-link" />
                </span>
              )}
            />
          </span>
        ) : null
        }
        {/* 5 of your friends follow Organization Name<br /> */}

        {/* twitter_followers_count ?
          <span className="twitter-followers__badge">
              <span className="fa fa-twitter twitter-followers__icon" />
            {numberWithCommas(twitter_followers_count)}
            </span> :
          null
        */}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  overflow-x: hidden;
`;

export default OrganizationPopoverCard;
