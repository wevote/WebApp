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
  SetUpAccountContactsText,
  SetUpAccountContactsTextWrapper,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';

const AddContactsFromGoogleButton = React.lazy(() => import(/* webpackChunkName: 'AddContactsFromGoogleButton' */ './AddContactsFromGoogleButton'));

const addressBookSVG = '../../../img/get-started/address-book.svg';

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
    const addressBookSVGSrc = normalizedImagePath(addressBookSVG);

    return (
      <StepCenteredWrapper>
        <>
          {voterContactEmailListCount ? (
            <SetUpAccountTop>
              <SetUpAccountTitle>
                {contactsWithAccountCount ? (
                  <>
                    {contactsWithAccountCount}
                    {' '}
                    found on We Vote!
                    {' '}
                  </>
                ) : (
                  <>
                    {voterContactEmailListCount}
                    {' '}
                    total contacts
                  </>
                )}
              </SetUpAccountTitle>
              <SetUpAccountContactsTextWrapper>
                <SetUpAccountContactsText>
                  {!!(contactsWithAccountCount) && (
                    <>
                      {voterContactEmailListCount}
                      {' '}
                      total contacts
                      <br />
                    </>
                  )}
                </SetUpAccountContactsText>
              </SetUpAccountContactsTextWrapper>
            </SetUpAccountTop>
          ) : (
            <>
              <SetUpAccountTitle>
                Find your contacts on
                {' '}
                <span className="u-no-break">We Vote</span>
              </SetUpAccountTitle>
              <SetUpAccountImportText>
                Importing your contacts helps
                {' '}
                <span className="u-no-break">We Vote</span>
                {' '}
                find your friends and suggest connections.
              </SetUpAccountImportText>
            </>
          )}
        </>
        <ImageAndButtonsWrapper>
          <MainImageWrapper>
            <div>
              <MainImageImg src={addressBookSVGSrc} alt="" />
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

const SetUpAccountImportText = styled('div')(({ theme }) => (`
  color: #999;
  font-size: 16px;
  padding: 0 20px;
  text-align: center;
  width: 275px;
  ${theme.breakpoints.up('sm')} {
    width: 350px;
  }
`));

export default withStyles(styles)(SetUpAccountImportContacts);
