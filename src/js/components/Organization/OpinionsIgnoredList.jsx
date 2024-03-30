import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import OrganizationDisplayForList from './OrganizationDisplayForList';

// NOTE FROM DALE: When OpinionsIgnoredList is refactored, this should be refactored to display Organizations instead of Voter Guides
export default class OpinionsIgnoredList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organizationsIgnored: this.props.organizationsIgnored,
    };
  }

  componentDidMount () {
    this.setState({
      organizationsIgnored: this.props.organizationsIgnored,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // if (nextProps.instantRefreshOn ) {
    // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
    this.setState({
      organizationsIgnored: nextProps.organizationsIgnored,
    });
  }

  render () {
    renderLog('OpinionsIgnoredList');  // Set LOG_RENDER_EVENTS to log all renders
    if (this.state.organizationsIgnored === undefined) {
      return null;
    }


    return (
      <OpinionsIgnoredListWrapper className="guidelist card-child__list-group">
        {this.state.organizationsIgnored.map((organization) => (
          <OrganizationDisplayForList
            key={organization.organization_we_vote_id}
            organizationName={organization.voter_guide_display_name}
            organizationPhotoUrlMedium={organization.voter_guide_image_url_medium}
            organizationWeVoteId={organization.organization_we_vote_id}
            twitterDescription={organization.twitter_description}
            twitterFollowersCount={organization.twitter_followers_count}
            twitterHandle={organization.twitter_handle}
          />
        ))}
      </OpinionsIgnoredListWrapper>
    );
  }
}
OpinionsIgnoredList.propTypes = {
  organizationsIgnored: PropTypes.array,
};

const OpinionsIgnoredListWrapper = styled('div')`
`;
