import { CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';
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


class RemindContactsPreview extends React.Component {
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
    // console.log('RemindContactsPreview componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
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
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();

    this.setState({
      // voterContactEmailAugmentSequenceComplete: VoterStore.getVoterContactEmailAugmentSequenceComplete(),
      voterContactEmailAugmentSequenceHasNextStep: VoterStore.getVoterContactEmailAugmentSequenceHasNextStep(),
      voterContactEmailListCount,
    });
  }

  render () {
    renderLog('RemindContactsPreview');  // Set LOG_RENDER_EVENTS to log all renders
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
                  We imported
                  {' '}
                  {voterContactEmailListCount}
                  {' '}
                  of your contacts
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
                        <span className="u-no-break">WeVote for your friends...</span>
                      </div>
                      <CircularProgressWrapper>
                        <CircularProgress />
                      </CircularProgressWrapper>
                    </>
                  ) : (
                    <>
                      We imported
                      {' '}
                      {voterContactEmailListCount}
                      {' '}
                      of your contacts
                    </>
                  )}
                </>
              )}
            </SetUpAccountTitle>
          ) : (
            <SetUpAccountTitle>
              No contacts imported
            </SetUpAccountTitle>
          )}
          {(voterContactEmailListCount === 0) && (
            <SetUpAccountContactsTextWrapper>
              <SetUpAccountContactsText>
                Click the back arrow to import contacts from another account.
              </SetUpAccountContactsText>
            </SetUpAccountContactsTextWrapper>
          )}
        </SetUpAccountTop>
        <Suspense fallback={<></>}>
          <ContactsImportedPreview />
        </Suspense>
      </StepCenteredWrapper>
    );
  }
}
RemindContactsPreview.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const CircularProgressWrapper = styled('div')`
  margin-top: 12px;
`;

export default RemindContactsPreview;
