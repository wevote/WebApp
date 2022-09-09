import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import { SectionDescription, SectionTitle } from '../Style/friendStyles';
import SuggestedContactListWithController from './SuggestedContactListWithController';

const AddContactsFromGoogleButton = React.lazy(() => import(/* webpackChunkName: 'AddContactsFromGoogleButton' */ '../SetUpAccount/AddContactsFromGoogleButton'));

export default class SuggestedContacts extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterContactEmailListCount: 0,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();
    this.setState({
      voterContactEmailListCount,
    });
  }

  render () {
    renderLog('SuggestedContacts');  // Set LOG_RENDER_EVENTS to log all renders
    const { askMode, messageToFriendsInputOff } = this.props;
    const { voterContactEmailListCount } = this.state;

    return (
      <>
        {(voterContactEmailListCount > 0) ? (
          <SuggestedContactsWrapper>
            <SectionTitle>
              Your Contacts
            </SectionTitle>
            <div>
              <SuggestedContactListWithController askMode={askMode} messageToFriendsInputOff={messageToFriendsInputOff} />
            </div>
          </SuggestedContactsWrapper>
        ) : (
          <SuggestedContactsWrapper>
            <SectionTitle>
              Find Your Contacts on We Vote
            </SectionTitle>
            <SectionDescription>
              Importing your contacts helps you find your friends on We Vote. You can delete your contact information at any time.
            </SectionDescription>
            <div>
              <Suspense fallback={<></>}>
                <AddContactsFromGoogleButton darkButton />
              </Suspense>
            </div>
          </SuggestedContactsWrapper>
        )}
      </>
    );
  }
}
SuggestedContacts.propTypes = {
  askMode: PropTypes.bool,
  messageToFriendsInputOff: PropTypes.bool,
};

const SuggestedContactsWrapper = styled('div')`
  margin-bottom: 48px;
`;
