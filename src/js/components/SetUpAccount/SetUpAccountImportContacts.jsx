import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { filter } from 'lodash-es';
import VoterActions from '../../actions/VoterActions';
import historyPush from '../../common/utils/historyPush';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { renderLog } from '../../common/utils/logging';
import { reassuranceText } from './reassuranceText';
import VoterStore from '../../stores/VoterStore';
import Reassurance from '../../pages/Startup/Reassurance';
import {
  SetUpAccountIntroText,
  SetUpAccountTitle,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';

const AddContactsFromGoogleButton = React.lazy(() => import(/* webpackChunkName: 'AddContactsFromGoogleButton' */ './AddContactsFromGoogleButton'));

const makeYourVoiceHeard = '../../../img/get-started/make-your-voice-heard-500x500.png';

class SetUpAccountImportContacts extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      contactsWithAccountCount: 0,
      deleteAllContactsConfirm: false,
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SetUpAccountImportContacts componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.goToInviteContacts();
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.functionToUseWhenProfileCompleteTimer) {
      clearTimeout(this.functionToUseWhenProfileCompleteTimer);
    }
  }

  onVoterStoreChange () {
    const voterContactEmailList = VoterStore.getVoterContactEmailList();
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();
    const contactsWithAccountList = filter(voterContactEmailList, (contact) => contact.voter_we_vote_id);
    const contactsWithAccountCount = contactsWithAccountList.length;
    this.setState({
      contactsWithAccountCount,
      voterContactEmailListCount,
    });
  }

  deleteAllContacts = () => {
    const deleteAllVoterContactEmails = true;
    VoterActions.voterContactListDelete(deleteAllVoterContactEmails);
  }

  deleteAllContactsConfirmToggle = () => {
    const { deleteAllContactsConfirm } = this.state;
    this.setState({
      deleteAllContactsConfirm: !deleteAllContactsConfirm,
    });
  }

  goToInviteContacts = () => {
    historyPush('/setupaccount/invitecontacts');
  }

  render () {
    renderLog('SetUpAccountImportContacts');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, displayStep } = this.props;
    const { contactsWithAccountCount, deleteAllContactsConfirm, voterContactEmailListCount } = this.state;
    const makeYourVoiceHeardSrc = normalizedImagePath(makeYourVoiceHeard);

    return (
      <StepCenteredWrapper>
        <>
          {voterContactEmailListCount ? (
            <>
              <SetUpAccountTitle>
                {voterContactEmailListCount}
                {' '}
                contacts found
              </SetUpAccountTitle>
              {contactsWithAccountCount && (
                <SetUpAccountIntroText>
                  {contactsWithAccountCount}
                  {' '}
                  already have accounts on We Vote!
                </SetUpAccountIntroText>
              )}
            </>
          ) : (
            <>
              <SetUpAccountTitle>
                Find your friends
              </SetUpAccountTitle>
              <SetUpAccountIntroText>
                See how your friends are voting on We Vote.
              </SetUpAccountIntroText>
            </>
          )}
        </>
        <ImageAndButtonsWrapper>
          <MainImageWrapper>
            <div>
              <MainImageImg src={makeYourVoiceHeardSrc} alt="" />
            </div>
          </MainImageWrapper>
          {(voterContactEmailListCount > 0) && (
            <AddContactsButtonWrapper>
              <Suspense fallback={<></>}>
                <AddContactsFromGoogleButton />
              </Suspense>
            </AddContactsButtonWrapper>
          )}
          <Reassurance displayState={displayStep} reassuranceText={reassuranceText} />
          {voterContactEmailListCount > 0 && (
            <DeleteContactsButtonOuterWrapper>
              {deleteAllContactsConfirm ? (
                <div className="full-width">
                  <DeleteContactsButtonInnerWrapper>
                    <Button
                      color="primary"
                      onClick={this.deleteAllContacts}
                      style={{
                        backgroundColor: 'red',
                        boxShadow: 'none !important',
                        textTransform: 'none',
                        width: 350,
                      }}
                      variant="contained"
                    >
                      Permanently delete all contacts
                    </Button>
                  </DeleteContactsButtonInnerWrapper>
                  <DeleteContactsButtonInnerCancelWrapper>
                    <Button
                      classes={{ root: classes.deleteAllContactsCancelLink }}
                      onClick={this.deleteAllContactsConfirmToggle}
                    >
                      Cancel
                    </Button>
                  </DeleteContactsButtonInnerCancelWrapper>
                </div>
              ) : (
                <Button
                  classes={{ root: classes.deleteAllContactsLink }}
                  onClick={this.deleteAllContactsConfirmToggle}
                >
                  Delete all contacts
                </Button>
              )}
            </DeleteContactsButtonOuterWrapper>
          )}
        </ImageAndButtonsWrapper>
      </StepCenteredWrapper>
    );
  }
}
SetUpAccountImportContacts.propTypes = {
  classes: PropTypes.object,
  displayStep: PropTypes.number,
  // functionToUseWhenProfileComplete: PropTypes.func.isRequired,
  // functionToUseWhenProfileNotComplete: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const styles = () => ({
  deleteAllContactsCancelLink: {
    boxShadow: 'none !important',
    color: '#999',
    marginTop: 10,
    padding: '0 20px',
    textTransform: 'none',
    width: 250,
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
  deleteAllContactsLink: {
    boxShadow: 'none !important',
    color: '#999',
    marginTop: 10,
    padding: '0 20px',
    textTransform: 'none',
    width: 250,
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
});

const AddContactsButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;

const DeleteContactsButtonInnerCancelWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  width: 100%;
`;

const DeleteContactsButtonInnerWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const DeleteContactsButtonOuterWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  width: 100%;
`;

const ImageAndButtonsWrapper = styled('div')`
  margin-top: 24px;
  width: 100%;
`;

const MainImageImg = styled('img')(({ theme }) => (`
  width: 200px;
  height: 200px;
  ${theme.breakpoints.down('sm')} {
    width: 150px;
    height: 150px;
  }
`));

const MainImageWrapper = styled('div')(({ theme }) => (`
  display: flex;
  justify-content: center;
  margin-bottom: 36px;
  ${theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
  }
`));

export default withStyles(styles)(SetUpAccountImportContacts);
