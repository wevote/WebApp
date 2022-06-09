import withStyles from '@mui/styles/withStyles';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { filter } from 'lodash-es';
import DeleteAllContactsButton from './DeleteAllContactsButton';
import historyPush from '../../common/utils/historyPush';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
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

  goToInviteContacts = () => {
    historyPush('/setupaccount/invitecontacts');
  }

  render () {
    renderLog('SetUpAccountImportContacts');  // Set LOG_RENDER_EVENTS to log all renders
    const { contactsWithAccountCount, voterContactEmailListCount } = this.state;
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
          {voterContactEmailListCount > 0 && (
            <DeleteAllContactsWrapper>
              <DeleteAllContactsButton />
            </DeleteAllContactsWrapper>
          )}
        </ImageAndButtonsWrapper>
      </StepCenteredWrapper>
    );
  }
}
SetUpAccountImportContacts.propTypes = {
  // functionToUseWhenProfileComplete: PropTypes.func.isRequired,
  // functionToUseWhenProfileNotComplete: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const styles = () => ({
});

const AddContactsButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;

const DeleteAllContactsWrapper = styled('div')`
  margin-top: 8px;
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
