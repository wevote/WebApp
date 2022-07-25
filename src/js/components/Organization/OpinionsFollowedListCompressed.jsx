import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import OrganizationActions from '../../actions/OrganizationActions';
import { renderLog } from '../../common/utils/logging';
import OrganizationDisplayForListCompressed from './OrganizationDisplayForListCompressed';

const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../Widgets/FollowToggle'));

export default class OpinionsFollowedListCompressed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organizationsFollowed: [],
    };
  }

  componentDidMount () {
    this.setState({
      organizationsFollowed: this.props.organizationsFollowed,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // if (nextProps.instantRefreshOn ) {
    // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
    this.setState({
      organizationsFollowed: nextProps.organizationsFollowed,
    });
    // }
  }

  handleIgnore (organizationWeVoteId) {
    OrganizationActions.organizationFollowIgnore(organizationWeVoteId);
    const { organizationsFollowed } = this.state;
    this.setState({
      organizationsFollowed: organizationsFollowed.filter((oneOrganization) => oneOrganization.organization_we_vote_id !== organizationWeVoteId),
    });
  }

  render () {
    renderLog('OpinionsFollowedListCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    if (this.state.organizationsFollowed === undefined) {
      return null;
    }
    // zachmonteith: extra span tags inside of OrganizationDisplayForList are to ensure that {organizationsList} gets passed in
    // as an array rather than an object, so that our propTypes validations in OrganizationDisplayForListCompressed work.
    const organizationsList = this.state.organizationsFollowed.map((oneOrganization) => {
      if (this.props.editMode) {
        return (
          <OrganizationDisplayForListCompressed key={oneOrganization.organization_we_vote_id} organization_we_vote_id={oneOrganization.organization_we_vote_id} organization_photo_url_medium={oneOrganization.organization_photo_url_medium} organization_name={oneOrganization.organization_name} organization_twitter_handle={oneOrganization.organization_twitter_handle}>
            <Suspense fallback={<></>}>
              <FollowToggle organizationWeVoteId={oneOrganization.organization_we_vote_id} />
            </Suspense>
            <span />
          </OrganizationDisplayForListCompressed>
        );
      } else {
        return (
          <OrganizationDisplayForListCompressed key={oneOrganization.organization_we_vote_id} organization_we_vote_id={oneOrganization.organization_we_vote_id} organization_photo_url_medium={oneOrganization.organization_photo_url_medium} organization_name={oneOrganization.organization_name} organization_twitter_handle={oneOrganization.organization_twitter_handle}>
            <span />
            <span />
          </OrganizationDisplayForListCompressed>
        );
      }
    });

    return (
      <div className="guidelist card-child__list-group">
        {organizationsList}
      </div>
    );
  }
}
OpinionsFollowedListCompressed.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  organizationsFollowed: PropTypes.array,
  instantRefreshOn: PropTypes.bool,
  editMode: PropTypes.bool,
};
