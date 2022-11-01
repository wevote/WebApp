import { CircularProgress } from '@mui/material';
import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';
import arrayContains from '../../common/utils/arrayContains';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import {
  SetUpAccountContactsText,
  SetUpAccountContactsTextWrapper,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';

const NUMBER_OF_CONTACTS_WITH_ACCOUNT_NAMES_TO_SHOW = 7; // Maximum available coming from API server is currently 5
const NUMBER_OF_CONTACTS_WITH_ACCOUNT_IMAGES_TO_SHOW = 7; // Maximum available coming from API server is currently 5

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
    const voterContactEmailList = VoterStore.getVoterContactEmailList();
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();

    // const contactsWithAccountList = filter(voterContactEmailList, (contact) => contact.voter_we_vote_id);
    const contactsWithAccountListRaw = filter(voterContactEmailList, (contact) => contact.first_name);
    const contactsWithAccountList = [];
    const existingFullNameList = [];
    let displayName = '';
    // Filter out duplicate names
    for (let i = 0; i < contactsWithAccountListRaw.length; i++) {
      displayName = contactsWithAccountListRaw[i].display_name;
      if (!arrayContains(displayName, existingFullNameList)) {
        existingFullNameList.push(displayName);
        contactsWithAccountList.push(contactsWithAccountListRaw[i]);
      }
    }
    let contactsWithAccountCount = 0;
    if (contactsWithAccountList) {
      contactsWithAccountCount = contactsWithAccountList.length;
    }

    this.setState({
      contactsWithAccountCount,
      contactsWithAccountList,
      // voterContactEmailAugmentSequenceComplete: VoterStore.getVoterContactEmailAugmentSequenceComplete(),
      voterContactEmailAugmentSequenceHasNextStep: VoterStore.getVoterContactEmailAugmentSequenceHasNextStep(),
      voterContactEmailListCount,
    });
  }

  orderByPhotoExists = (firstContactWithAccount, secondContactWithAccount) => {
    const secondContactWithAccountHasPhoto = secondContactWithAccount && secondContactWithAccount.we_vote_hosted_profile_image_url_medium && secondContactWithAccount.we_vote_hosted_profile_image_url_medium.length ? 1 : 0;
    const firstContactWithAccountHasPhoto = firstContactWithAccount && firstContactWithAccount.we_vote_hosted_profile_image_url_medium && firstContactWithAccount.we_vote_hosted_profile_image_url_medium.length ? 1 : 0;
    return secondContactWithAccountHasPhoto - firstContactWithAccountHasPhoto;
  };

  render () {
    renderLog('RemindContactsPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      contactsWithAccountCount, contactsWithAccountList,
      voterContactEmailAugmentSequenceHasNextStep, voterContactEmailListCount,
    } = this.state;
    // console.log('contactsWithAccountList:', contactsWithAccountList);

    let isFirst;
    let contactWithAccountImageCount = 0;
    let contactWithAccountNameCount = 0;
    let contactsWithAccountNameList = <></>;
    let contactsWithAccountTotalNumber = 0;
    if (contactsWithAccountList) {
      contactsWithAccountTotalNumber = contactsWithAccountList.length;
    }
    let contactsImageHtmlArray = <></>;
    if (contactsWithAccountList) {
      const contactsWithAccountListSorted = contactsWithAccountList.sort(this.orderByPhotoExists);
      contactsWithAccountNameList = (
        <ContactNamesWrapper>
          {contactsWithAccountListSorted.map((contactWithAccount) => {
            // console.log('organization:', organization);
            if (contactWithAccount.display_name) {
              contactWithAccountNameCount += 1;
              if (contactWithAccountNameCount <= NUMBER_OF_CONTACTS_WITH_ACCOUNT_NAMES_TO_SHOW) {
                return (
                  <OneFriendName key={`ContactWithAccountImage-${contactWithAccount.voter_we_vote_id}-${contactWithAccountNameCount}`}>
                    {((contactWithAccountNameCount > 1) && (contactWithAccountNameCount === contactsWithAccountTotalNumber)) && (
                      <> and </>
                    )}
                    {contactWithAccount.display_name}
                    {(contactWithAccountNameCount < (contactsWithAccountTotalNumber - 1)) && (
                      <>, </>
                    )}
                  </OneFriendName>
                );
              } else if (contactWithAccountNameCount === (NUMBER_OF_CONTACTS_WITH_ACCOUNT_NAMES_TO_SHOW + 1)) {
                return (
                  <span className="u-no-break" key={`ContactWithAccountImage-${contactWithAccount.voter_we_vote_id}-${contactWithAccountNameCount}`}>
                    and
                    {' '}
                    {contactsWithAccountTotalNumber - contactWithAccountNameCount + 1}
                    {' '}
                    more.
                  </span>
                );
              } else {
                return null;
              }
            } else {
              return null;
            }
          })}
        </ContactNamesWrapper>
      );
      contactsImageHtmlArray = contactsWithAccountList.map((contactWithAccount) => {
        isFirst = contactWithAccountImageCount === 0;
        // console.log('organization:', organization);
        if (contactWithAccount.we_vote_hosted_profile_image_url_medium) {
          contactWithAccountImageCount += 1;
          if (contactWithAccountImageCount <= NUMBER_OF_CONTACTS_WITH_ACCOUNT_IMAGES_TO_SHOW) {
            return (
              <ContactWithAccountImage
                alt=""
                isFirst={isFirst}
                key={`ContactWithAccountImage-${contactWithAccountImageCount}`}
                contactWithAccountImageCount={contactWithAccountImageCount}
                src={contactWithAccount.we_vote_hosted_profile_image_url_medium}
                title={contactWithAccount.display_name}
              />
            );
          } else {
            return null;
          }
        } else {
          return null;
        }
      });
    }

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
                        <span className="u-no-break">We Vote for your friends...</span>
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
        {(contactsWithAccountCount > 0) && (
          <ContactsWithAccountWrapper>
            <ContactWithAccountsBlockWrapper>
              {(contactWithAccountImageCount > 0) && (
                <ContactWithAccountPreviewListImages>
                  {contactsImageHtmlArray.map((contactWithAccountImageHtml) => contactWithAccountImageHtml)}
                </ContactWithAccountPreviewListImages>
              )}
              {contactsWithAccountNameList}
            </ContactWithAccountsBlockWrapper>
          </ContactsWithAccountWrapper>
        )}
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

const ContactsWithAccountWrapper = styled('div')`
`;

const ContactWithAccountPreviewListImages = styled('div')`
  align-items: center;
  display: flex;
  justify-content: start;
  margin-right: 2px;
`;

const ContactWithAccountsBlockWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  justify-content: center;
  margin-top: -3px;
`;

const ContactWithAccountImage = styled('img', {
  shouldForwardProp: (prop) => !['isFirst', 'contactWithAccountImageCount'].includes(prop),
})(({ isFirst, contactWithAccountImageCount }) => (`
  border: 2px solid #fff;
  border-radius: 24px;
  height: 48px;
  margin-top: 3px;
  ${!isFirst ? 'margin-left: -8px;' : ''}
  width: 48px;
  z-index: ${200 - contactWithAccountImageCount};
`));

const ContactNamesWrapper = styled('div')`
  text-align: center;
`;

const OneFriendName = styled('span')`
`;

export default RemindContactsPreview;
