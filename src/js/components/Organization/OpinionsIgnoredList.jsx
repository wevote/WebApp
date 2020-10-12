import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FollowToggle from '../Widgets/FollowToggle';
import VoterGuideDisplayForList from '../VoterGuide/VoterGuideDisplayForList';
import { renderLog } from '../../utils/logging';

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
      <div className="guidelist card-child__list-group">
        {this.state.organizationsIgnored.map((oneOrganization) => (
          <VoterGuideDisplayForList
            key={oneOrganization.organization_we_vote_id}
            organizationWeVoteId={oneOrganization.organization_we_vote_id}
            voterGuideImageUrlLarge={oneOrganization.voter_guide_image_url_large}
            voterGuideDisplayName={oneOrganization.voter_guide_display_name}
            twitterDescription={oneOrganization.twitter_description}
            twitterFollowersCount={oneOrganization.twitter_followers_count}
            twitterHandle={oneOrganization.twitter_handle}
          >
            <FollowToggle organizationWeVoteId={oneOrganization.organization_we_vote_id} />
          </VoterGuideDisplayForList>
        ))}
      </div>
    );
  }
}
OpinionsIgnoredList.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  organizationsIgnored: PropTypes.array,
  instantRefreshOn: PropTypes.bool,
};
