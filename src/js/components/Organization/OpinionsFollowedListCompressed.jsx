import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FollowToggle from '../Widgets/FollowToggle';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationDisplayForListCompressed from './OrganizationDisplayForListCompressed';
import { renderLog } from '../../utils/logging';

export default class OpinionsFollowedListCompressed extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    organizationsFollowed: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
    editMode: PropTypes.bool,
  };

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

  componentWillReceiveProps (nextProps) {
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
      organizationsFollowed: organizationsFollowed.filter(oneOrganization => oneOrganization.organization_we_vote_id !== organizationWeVoteId),
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.organizationsFollowed === undefined) {
      return null;
    }
    // zachmonteith: extra span tags inside of OrganizationDisplayForList are to ensure that {organizationsList} gets passed in
    // as an array rather than an object, so that our propTypes validations in OrganizationDisplayForListCompressed work.
    const organizationsList = this.state.organizationsFollowed.map((oneOrganization) => {
      if (this.props.editMode) {
        return (
          <OrganizationDisplayForListCompressed key={oneOrganization.organization_we_vote_id} {...oneOrganization}>
            <FollowToggle organizationWeVoteId={oneOrganization.organization_we_vote_id} />
            <span />
          </OrganizationDisplayForListCompressed>
        );
      } else {
        return (
          <OrganizationDisplayForListCompressed key={oneOrganization.organization_we_vote_id} {...oneOrganization}>
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
