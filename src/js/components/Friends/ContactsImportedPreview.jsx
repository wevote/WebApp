import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';
import arrayContains from '../../common/utils/arrayContains';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';

const NUMBER_OF_CONTACTS_WITH_ACCOUNT_NAMES_TO_SHOW = 7; // Maximum available coming from API server is currently 5
const NUMBER_OF_CONTACTS_WITH_ACCOUNT_IMAGES_TO_SHOW = 7; // Maximum available coming from API server is currently 5

class ContactsImportedPreview extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
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

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const { showOnlyContactsWithAccounts } = this.props;
    const voterContactEmailList = VoterStore.getVoterContactEmailList();

    let contactsWithAccountListRaw = filter(voterContactEmailList, (contact) => contact.first_name);
    if (showOnlyContactsWithAccounts) {
      contactsWithAccountListRaw = filter(contactsWithAccountListRaw, (contact) => contact.voter_we_vote_id);
    }
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
    });
  }

  orderByPhotoExists = (firstContactWithAccount, secondContactWithAccount) => {
    const secondContactWithAccountHasPhoto = secondContactWithAccount && secondContactWithAccount.we_vote_hosted_profile_image_url_medium && secondContactWithAccount.we_vote_hosted_profile_image_url_medium.length ? 1 : 0;
    const firstContactWithAccountHasPhoto = firstContactWithAccount && firstContactWithAccount.we_vote_hosted_profile_image_url_medium && firstContactWithAccount.we_vote_hosted_profile_image_url_medium.length ? 1 : 0;
    return secondContactWithAccountHasPhoto - firstContactWithAccountHasPhoto;
  };

  render () {
    renderLog('ContactsImportedPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      contactsWithAccountCount, contactsWithAccountList,
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
          Including
          {' '}
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
      <ContactsImportedPreviewOuterWrapper>
        {(contactsWithAccountCount > 0) && (
          <ContactsImportedPreviewInnerWrapper>
            {(contactWithAccountImageCount > 0) && (
              <ContactWithAccountPreviewListImages>
                {contactsImageHtmlArray.map((contactWithAccountImageHtml) => contactWithAccountImageHtml)}
              </ContactWithAccountPreviewListImages>
            )}
            {contactsWithAccountNameList}
          </ContactsImportedPreviewInnerWrapper>
        )}
      </ContactsImportedPreviewOuterWrapper>
    );
  }
}
ContactsImportedPreview.propTypes = {
  showOnlyContactsWithAccounts: PropTypes.bool,
};

const ContactsImportedPreviewInnerWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
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

const ContactsImportedPreviewOuterWrapper = styled('div')`
`;

const ContactWithAccountPreviewListImages = styled('div')`
  align-items: center;
  display: flex;
  justify-content: start;
  margin-right: 2px;
`;

const ContactNamesWrapper = styled('div')`
  text-align: center;
`;

const OneFriendName = styled('span')`
`;

export default ContactsImportedPreview;
