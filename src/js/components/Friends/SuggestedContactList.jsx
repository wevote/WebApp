import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import SuggestedFriendDisplayForList from './SuggestedFriendDisplayForList';

export default class SuggestedContactList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // suggestedContactList: [],
    };
  }

  render () {
    renderLog('SuggestedContactList');  // Set LOG_RENDER_EVENTS to log all renders
    const { askMode, numberOfItemsToDisplay, remindMode, voterContactEmailList } = this.props;
    if (voterContactEmailList === undefined) {
      return null;
    }
    const { previewMode } = this.props;
    let numberOfItemsDisplayed = 0;
    return (
      <SuggestedContactListWrapper>
        {voterContactEmailList.map((contact, index) => {
          // console.log('numberOfItemsDisplayed: ', numberOfItemsDisplayed);
          if (numberOfItemsDisplayed >= numberOfItemsToDisplay) {
            return null;
          }
          numberOfItemsDisplayed += 1;
          // console.log('numberOfItemsDisplayed: ', numberOfItemsDisplayed, 'contact:', contact);
          return (
            <div key={`${contact.email_address_text}-${contact.google_contact_id}-${contact.id}`}>
              <SuggestedFriendDisplayForList
                askMode={askMode}
                cityForDisplay={contact.city}
                emailAddressForDisplay={contact.email_address_text}
                indicateIfAlreadyOnWeVote
                // linkedOrganizationWeVoteId={contact.linked_organization_we_vote_id}
                // mutualFriends={contact.mutual_friends}
                // positionsTaken={contact.positions_taken}
                previewMode={previewMode}
                remindMode={remindMode}
                stateCodeForDisplay={contact.state_code}
                voterContactIgnored={contact.ignore_contact}
                voterDisplayName={contact.display_name}
                voterFirstName={contact.first_name}
                voterLastName={contact.last_name}
                voterPhotoUrlLarge={contact.we_vote_hosted_profile_image_url_medium}
                voterWeVoteId={contact.voter_we_vote_id}
              />
              {index !== voterContactEmailList.length - 1 ? (
                <hr />
              ) : null}
            </div>
          );
        })}
      </SuggestedContactListWrapper>
    );
  }
}
SuggestedContactList.propTypes = {
  askMode: PropTypes.bool,
  numberOfItemsToDisplay: PropTypes.number,
  previewMode: PropTypes.bool,
  remindMode: PropTypes.bool,
  voterContactEmailList: PropTypes.array,
};

const SuggestedContactListWrapper = styled('div')`
  width: 100%;
`;
