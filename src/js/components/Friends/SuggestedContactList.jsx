import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import SuggestedFriendDisplayForList from './SuggestedFriendDisplayForList';

export default class SuggestedContactList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      suggestedContactList: [],
    };
  }

  componentDidMount () {
    const { voterContactEmailList: suggestedContactList } = this.props;
    this.setState({
      suggestedContactList,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({
      suggestedContactList: nextProps.voterContactEmailList,
    });
  }

  render () {
    renderLog('SuggestedContactList');  // Set LOG_RENDER_EVENTS to log all renders
    const { numberOfItemsToDisplay } = this.props;
    const { suggestedContactList } = this.state;
    if (suggestedContactList === undefined) {
      return null;
    }
    const { previewMode } = this.props;
    let numberOfItemsDisplayed = 0;

    return (
      <div>
        <div>
          {suggestedContactList.map((contact, index) => {
            // console.log('numberOfItemsDisplayed: ', numberOfItemsDisplayed);
            if (numberOfItemsDisplayed >= numberOfItemsToDisplay) {
              return null;
            }
            numberOfItemsDisplayed += 1;
            // console.log('numberOfItemsDisplayed: ', numberOfItemsDisplayed);
            return (
              <div key={`${contact.email_address_text}-${contact.google_contact_id}`}>
                <SuggestedFriendDisplayForList
                  indicateIfAlreadyOnWeVote
                  // linkedOrganizationWeVoteId={contact.linked_organization_we_vote_id}
                  // mutualFriends={contact.mutual_friends}
                  // positionsTaken={contact.positions_taken}
                  previewMode={previewMode}
                  cityForDisplay={contact.city}
                  stateCodeForDisplay={contact.state_code}
                  voterContactIgnored={contact.ignore_contact}
                  voterDisplayName={contact.display_name}
                  emailAddressForDisplay={contact.email_address_text}
                  voterPhotoUrlLarge={contact.we_vote_hosted_profile_image_url_medium}
                  voterWeVoteId={contact.voter_we_vote_id}
                />
                {index !== suggestedContactList.length - 1 ? (
                  <hr />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
SuggestedContactList.propTypes = {
  numberOfItemsToDisplay: PropTypes.number,
  previewMode: PropTypes.bool,
  voterContactEmailList: PropTypes.array,
};
