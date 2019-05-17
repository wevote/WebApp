import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FollowToggle from '../Widgets/FollowToggle';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationDisplayForList from './OrganizationDisplayForList';
import { renderLog } from '../../utils/logging';

export default class OpinionsFollowedList extends Component {
  static propTypes = {
    organizationsFollowed: PropTypes.array,
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
    this.setState({
      organizationsFollowed: nextProps.organizationsFollowed,
    });
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
    // console.log('OpinionsFollowedList, this.state.organizationsFollowed: ', this.state.organizationsFollowed);
    // zachmonteith: extra span tags inside of OrganizationDisplayForList are to ensure that {org} gets passed in
    // as an array rather than an object, so that our propTypes validations in OrganizationDisplayForList work.
    const organizationsList = this.state.organizationsFollowed.map((oneOrganization) => { // eslint-disable-line
      return (
        <OrganizationDisplayForList key={oneOrganization.organization_we_vote_id} organizationWeVoteId={oneOrganization.organization_we_vote_id}>
          <FollowToggle organizationWeVoteId={oneOrganization.organization_we_vote_id} />
          <span />
        </OrganizationDisplayForList>
      );
    });

    return (
      <div className="guidelist card-child__list-group">
        {organizationsList}
      </div>
    );
  }
}
