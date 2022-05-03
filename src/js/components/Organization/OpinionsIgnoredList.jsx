import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { renderLog } from '../../common/utils/logging';
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
          <VoterGuideDisplayForList
            isInformationOnly={oneOrganization.is_information_only}
            isOppose={oneOrganization.is_oppose}
            isSupport={oneOrganization.is_support}
            key={oneOrganization.organization_we_vote_id}
            organizationWeVoteId={oneOrganization.organization_we_vote_id}
            twitterDescription={oneOrganization.twitter_description}
            twitterHandle={oneOrganization.twitter_handle}
            voterGuideImageUrlLarge={oneOrganization.voter_guide_image_url_large}
            voterGuideDisplayName={oneOrganization.voter_guide_display_name}
            voteSmartRating={oneOrganization.vote_smart_rating}
          >
            <Suspense fallback={<></>}>
              <FollowToggle organizationWeVoteId={oneOrganization.organization_we_vote_id} />
            </Suspense>
          </VoterGuideDisplayForList>
        ))}
      </div>
    );
  }
}
OpinionsIgnoredList.propTypes = {
  organizationsIgnored: PropTypes.array,
};
