import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import FollowToggle from '../Widgets/FollowToggle';
import VoterGuideDisplayForList from '../VoterGuide/VoterGuideDisplayForList';
import { renderLog } from '../../utils/logging';

// NOTE FROM DALE: When OpinionsIgnoredList is refactored, this should be refactored to display Organizations instead of Voter Guides
export default class OpinionsIgnoredList extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    organizationsIgnored: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
    editMode: PropTypes.bool,
  };

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

  componentWillReceiveProps (nextProps) {
    // if (nextProps.instantRefreshOn ) {
    // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
    this.setState({
      organizationsIgnored: nextProps.organizationsIgnored,
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.organizationsIgnored === undefined) {
      return null;
    }

    let counter = 0;

    // zachmonteith: extra span tags inside of VoterGuideDisplayForList are to ensure that {org} gets passed in
    // as an array rather than an object, so that our propTypes validations in VoterGuideDisplayForList work.
    return (
      <div className="guidelist card-child__list-group">
        <TransitionGroup className="org-ignore">
          {this.state.organizationsIgnored.map(oneOrganization => (
            <CSSTransition key={counter++} timeout={500} classNames="fade">
              <VoterGuideDisplayForList key={oneOrganization.organization_we_vote_id} {...oneOrganization}>
                { this.props.editMode ? <FollowToggle organizationWeVoteId={oneOrganization.organization_we_vote_id} /> : (
                  <span>
                    <span />
                    <span />
                  </span>
                ) }
              </VoterGuideDisplayForList>
            </CSSTransition>
          ))
        }
        </TransitionGroup>
      </div>
    );
  }
}
