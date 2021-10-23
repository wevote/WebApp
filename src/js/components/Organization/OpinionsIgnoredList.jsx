import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';
import VoterGuideDisplayForList from '../VoterGuide/VoterGuideDisplayForList';

const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../Widgets/FollowToggle'));

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
          <VoterGuideDisplayForList key={oneOrganization.organization_we_vote_id}
          organizationWeVoteId={oneOrganization.organization_we_vote_id}
          voterGuideImageUrlLarge={oneOrganization.voter_guide_image_url_large}
          voterGuideDisplayName={oneOrganization.voter_guide_display_name}
          candidateName={oneOrganization.candidate_name}
          speakerDisplayName={oneOrganization.speaker_display_name}
          twitterDescription={oneOrganization.twitter_description}
          twitterFollowersCount={oneOrganization.twitter_followers_count}
          twitterHandle={oneOrganization.twitter_handle}
          isSupport={oneOrganization.is_support}
          isPositiveRating={oneOrganization.is_positive_rating}
          isOppose={oneOrganization.is_oppose}
          isNegativeRating={oneOrganization.is_negative_rating}
          isInformationOnly={oneOrganization.is_information_only}
          voteSmartRating={oneOrganization.vote_smart_rating}
          speakerText={oneOrganization.speaker_text}
          moreInfoUrl={oneOrganization.more_info_url}
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
