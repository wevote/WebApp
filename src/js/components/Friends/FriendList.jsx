import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import FriendDisplayForList from './FriendDisplayForList';

const ShowMoreItems = React.lazy(() => import(/* webpackChunkName: 'ShowMoreItems' */ '../Widgets/ShowMoreItems'));

export default class FriendList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loadingMoreItems: false,
    };
  }

  render () {
    renderLog('FriendList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      electionDateInFutureFormatted, electionDateIsToday, friendList,
      friendToggleOff, messageToFriendButtonOn, messageToFriendDefault,
      numberOfItemsToDisplay, previewMode,
    } = this.props;
    // console.log('friendList:', friendList);
    const {
      loadingMoreItems,
    } = this.state;
    const totalCurrentFriendListCount = friendList ? friendList.length : 0;
    // console.log('numberOfItemsToDisplay:', numberOfItemsToDisplay);
    // console.log('totalCurrentFriendListCount:', totalCurrentFriendListCount);

    if (!friendList) {
      return null;
    }
    let numberOfItemsDisplayed = 0;

    return (
      <div>
        {friendList.map((friend) => {
          // console.log('numberOfItemsDisplayed: ', numberOfItemsDisplayed);
          if (numberOfItemsDisplayed >= numberOfItemsToDisplay) {
            return null;
          }
          numberOfItemsDisplayed += 1;
          // console.log('friend: ', friend);
          return (
            <FriendDisplayForList
              electionDateInFutureFormatted={electionDateInFutureFormatted}
              electionDateIsToday={electionDateIsToday}
              friendToggleOff={friendToggleOff}
              key={`friendDisplay-${friend.voter_we_vote_id}`}
              linkedOrganizationWeVoteId={friend.linked_organization_we_vote_id}
              messageToFriendButtonOn={messageToFriendButtonOn}
              messageToFriendDefault={messageToFriendDefault}
              mutualFriendCount={friend.mutual_friend_count}
              mutualFriendPreviewList={friend.mutual_friend_preview_list}
              positionsTaken={friend.positions_taken}
              previewMode={previewMode}
              stateCodeForDisplay={friend.state_code_for_display}
              voterDisplayName={friend.voter_display_name}
              voterEmailAddress={friend.voter_email_address}
              voterPhotoUrlLarge={friend.voter_photo_url_large}
              voterTwitterHandle={friend.voter_twitter_handle}
              voterWeVoteId={friend.voter_we_vote_id}
            />
          );
        })}
        {!!(totalCurrentFriendListCount && !previewMode) && (
          <ShowMoreItemsWrapper onClick={() => this.props.increaseNumberOfItemsToDisplay}>
            <Suspense fallback={<></>}>
              <ShowMoreItems
                loadingMoreItemsNow={loadingMoreItems}
                numberOfItemsDisplayed={numberOfItemsDisplayed}
                numberOfItemsTotal={totalCurrentFriendListCount}
              />
            </Suspense>
          </ShowMoreItemsWrapper>
        )}
      </div>
    );
  }
}
FriendList.propTypes = {
  electionDateInFutureFormatted: PropTypes.string,
  electionDateIsToday: PropTypes.bool,
  friendList: PropTypes.array,
  friendToggleOff: PropTypes.bool,
  increaseNumberOfItemsToDisplay: PropTypes.func,
  messageToFriendButtonOn: PropTypes.bool,
  messageToFriendDefault: PropTypes.string,
  numberOfItemsToDisplay: PropTypes.number,
  previewMode: PropTypes.bool,
};

const ShowMoreItemsWrapper = styled('div')`
  margin-bottom: 16px;
`;
