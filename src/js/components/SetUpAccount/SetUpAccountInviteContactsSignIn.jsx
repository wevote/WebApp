import { CircularProgress } from '@mui/material';
import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';
import { SetUpSignInOptionsPanelWrapper } from '../Style/SignInStyles';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import {
  SetUpAccountContactsText,
  SetUpAccountContactsTextWrapper,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';

const ContactsImportedPreview = React.lazy(() => import(/* webpackChunkName: 'ContactsImportedPreview' */ '../Friends/ContactsImportedPreview'));
const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../../common/components/SignIn/SignInOptionsPanel'));


class SetUpAccountInviteContactsSignIn extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      voterContactEmailListCount: 0,
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (apiCalming('voterContactListRetrieve', 20000)) {
      VoterActions.voterContactListRetrieve();
    }
  }

  componentDidUpdate (prevProps) {
    // console.log('SetUpAccountInviteContactsSignIn componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      if (this.props.goToNextStep) {
        this.props.goToNextStep();
      }
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voterContactEmailList = VoterStore.getVoterContactEmailList();
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();

    const contactsWithAccountList = filter(voterContactEmailList, (contact) => contact.voter_we_vote_id);
    let contactsWithAccountCount = 0;
    if (contactsWithAccountList) {
      contactsWithAccountCount = contactsWithAccountList.length;
    }

    this.setState({
      contactsWithAccountCount,
      // voterContactEmailAugmentSequenceComplete: VoterStore.getVoterContactEmailAugmentSequenceComplete(),
      voterContactEmailAugmentSequenceHasNextStep: VoterStore.getVoterContactEmailAugmentSequenceHasNextStep(),
      voterContactEmailListCount,
    });
  }

  render () {
    renderLog('SetUpAccountInviteContactsSignIn');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      contactsWithAccountCount,
      voterContactEmailAugmentSequenceHasNextStep, voterContactEmailListCount,
    } = this.state;

    // console.log('voterContactEmailList:', voterContactEmailList);
    return (
      <StepCenteredWrapper>
        <SetUpAccountTop>
          {(voterContactEmailListCount > 0) ? (
            <SetUpAccountTitle>
              {(contactsWithAccountCount > 0) ? (
                <>
                  {contactsWithAccountCount}
                  {' '}
                  of your friends are already on
                  {' '}
                  <span className="u-no-break">We Vote</span>
                </>
              ) : (
                <>
                  {voterContactEmailAugmentSequenceHasNextStep ? (
                    <>
                      <div>
                        {voterContactEmailListCount}
                        {' '}
                        contacts saved. Searching
                        {' '}
                        <span className="u-no-break">We Vote for your friends...</span>
                      </div>
                      <CircularProgressWrapper>
                        <CircularProgress />
                      </CircularProgressWrapper>
                    </>
                  ) : (
                    <>
                      Imported
                      {' '}
                      {voterContactEmailListCount}
                      {' '}
                      contacts, but they did not match any existing
                      <span className="u-no-break"> We Vote </span>
                      voters.
                    </>
                  )}
                </>
              )}
            </SetUpAccountTitle>
          ) : (
            <SetUpAccountTitle>
              Be the first of your friends
              {' '}
              <span className="u-no-break">to join We Vote</span>
            </SetUpAccountTitle>
          )}
          {(voterContactEmailListCount > 0) && (
            <SetUpAccountContactsTextWrapper>
              <SetUpAccountContactsText>
                {!!((contactsWithAccountCount === 0) && (voterContactEmailListCount > 0) && !voterContactEmailAugmentSequenceHasNextStep) && (
                  <>
                    Be the first in your network of
                    {' '}
                    {voterContactEmailListCount}
                    {' '}
                    contacts to join We Vote.
                    <br />
                  </>
                )}
              </SetUpAccountContactsText>
            </SetUpAccountContactsTextWrapper>
          )}
        </SetUpAccountTop>
        <Suspense fallback={<></>}>
          <ContactsImportedPreview showOnlyContactsWithAccounts />
        </Suspense>
        <SetUpSignInOptionsPanelWrapper>
          <Suspense fallback={<></>}>
            <SignInOptionsPanel
              pleaseSignInTitle={(contactsWithAccountCount > 0) ? 'Sign in to connect with your friends' : ''}
              pleaseSignInSubTitle={(contactsWithAccountCount > 0) ? 'After you sign in, you will be able to choose which friends to collaborate with.' : ''}
            />
          </Suspense>
        </SetUpSignInOptionsPanelWrapper>
      </StepCenteredWrapper>
    );
  }
}
SetUpAccountInviteContactsSignIn.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const CircularProgressWrapper = styled('div')`
  margin-top: 12px;
`;


export default SetUpAccountInviteContactsSignIn;
