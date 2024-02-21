import { Button, CircularProgress } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { loadGapiInsideDOM } from 'gapi-script';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import GoogleButton from 'react-google-button';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import { isAndroid } from '../../common/utils/cordovaUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config'; // eslint-disable-line import/no-cycle
import AddContactConsts from '../../constants/AddContactConsts';
import VoterStore from '../../stores/VoterStore';
import { checkPermissionContacts } from './cordovaContactUtils';
import { parseRawAppleContacts } from './parseRawAppleContacts';


class AddContactsFromGoogleButton extends Component {
  constructor (props) {
    super(props);

    this.state = {
      addContactsState: AddContactConsts.uninitialized,
      errorMessageFromGoogle: '',
      // setOfContacts: new Set(),
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (isWebApp()) {
      try {
        loadGapiInsideDOM().then(() => {
          // console.log('AddContactsFromGoogleButton loadGapiInsideDOM onload:');
          window.gapi.load('client:auth2', this.initClient.bind(this));
          // console.log('AddContactsFromGoogleButton loadGapiInsideDOM after onload window.gapi:', window.gapi);
        });
      } catch (error) {
        console.log('loadGapiInsideDOM try/catch error: ', error);
      }
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.googleSignInListener) {
      this.googleSignInListener.remove();
    }
    if (this.timer) clearTimeout(this.timer);
  }

  handleRawAppleContacts (conslist) {
    // TODO Dec 7, 2021:  plugin does not ask for address, but I could modify the swift code and try:  https://github.com/EinfachHans/cordova-plugin-contacts-x/blob/master/src/ios/ContactsX.swift
    // https://developer.apple.com/forums/thread/131417
    console.log('entry to handleRawAppleContacts');
    const cleanedAppleContacts = parseRawAppleContacts(conslist);
    if (cleanedAppleContacts.length) {
      console.log('cleaned contacts from handleRawAppleContacts', cleanedAppleContacts);
      VoterActions.voterContactListSave(cleanedAppleContacts, true);  // won't save on the serve without a true here...
      window.deferredSetStateWithinNativeCallback = AddContactConsts.sendingContacts;
    } else {
      console.log('cleaned contacts from handleRawAppleContacts response was EMPTY');
      window.deferredSetStateWithinNativeCallback = AddContactConsts.noContactsFound;
    }
  }

  onGoogleSignIn = (signedIn) => {
    // const { gapi } = window;
    const { addContactsState } = this.state;
    // const signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    // console.log('onGoogleSignIn 1 >>>>>>>> addContactsState:', addContactsState);
    if (addContactsState === AddContactConsts.requestingSignIn) {
      if (signedIn) {
        this.setState({ addContactsState: AddContactConsts.requestingContacts });
        console.log('requestingContacts from Google after requestingSignIn');
        this.getOtherConnections();
      } else {
        console.log('Google signIn failed');
        this.setState({ addContactsState: AddContactConsts.initializedSignedOut });
      }
    } else if (addContactsState === AddContactConsts.requestingContacts) {
      console.log('onGoogleSignIn requestingContacts block');
    } else if (addContactsState === AddContactConsts.uninitialized) {
      if (signedIn) {
        if (addContactsState !== AddContactConsts.initializedSignedIn) {
          this.setState({ addContactsState: AddContactConsts.initializedSignedIn });
        }
      } else if (addContactsState !== AddContactConsts.initializedSignedOut) {
        this.setState({ addContactsState: AddContactConsts.initializedSignedOut });
      }
    } else {
      console.log('onGoogleSignIn no action taken');
    }
  }

  onVoterStoreChange () {
    const { googleContactsStored } = VoterStore.getState();
    const { addContactsState } = this.state;
    // console.log('onVoterStoreChange, addContactsState:', addContactsState);
    if (addContactsState === AddContactConsts.sendingContacts) {
      if (googleContactsStored && googleContactsStored > 0) {
        // console.log('onVoterStoreChange googleContactsStored:', googleContactsStored);
        if (addContactsState !== AddContactConsts.savedContacts) {
          this.setState({ addContactsState: AddContactConsts.savedContacts });
        } else {
          // console.log('NOT updating addContactsState');
        }
      } else if (addContactsState !== AddContactConsts.initializedSignedIn) {
        this.setState({ addContactsState: AddContactConsts.initializedSignedIn });
      }
    }
  }

  onButtonClickWebApp = () => {
    // const { addContactsState, setOfContacts } = this.state;
    const { gapi } = window;
    // 2022-06-23 We always want to give the voter a chance to choose another account to import from
    try {
      const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      // console.log('onButtonClickWebApp isSignedIn:', isSignedIn);
      if (isSignedIn) {
        // console.log('Getting contacts from Google on button click, since we were logged into Google');
        this.getOtherConnections();
        this.setState({ addContactsState: AddContactConsts.requestingContacts });
      } else {
        // console.log('Getting Auth from Google on button click, since we were not logged into Google');
        gapi.auth2.getAuthInstance().signIn();
        this.setState({ addContactsState: AddContactConsts.requestingSignIn });
      }
    } catch (error) {
      console.log('onButtonClickWebApp try/catch error: ', error);
    }
  }

  onButtonClickIos = () => {
    if (window.contactPermissionIos === 'cancelled') {
      this.setState({ addContactsState: AddContactConsts.permissionDenied });
      console.error('Permissions were cancelled');
    } else {
      checkPermissionContacts(this.handleRawAppleContacts);
      this.timer = setTimeout(() => {
        if (window.deferredSetStateWithinNativeCallback) {
          this.setState({ addContactsState: window.deferredSetStateWithinNativeCallback });
          window.deferredSetStateWithinNativeCallback = null;
        }
      }, 500);
    }
  }

  processGooglePeopleMeResponse = (result) => {
    // If we got a name back from Google, and the current voter doesn't have a name stored yet, save it
    // This way, if a voter who isn't fully signed in is reminding friends to vote, at least we can show their name.
    // console.log('processGooglePeopleMeResponse');
    if (result && result.names && result.names[0]) {
      const { displayName: fullName, familyName: lastName, givenName: firstName } = result.names[0];
      console.log('firstName:', firstName, ', lastName:', lastName, ', fullName:', fullName);
      VoterActions.voterFullNameSoftSave(firstName, lastName, fullName);
    } else {
      console.log('processGooglePeopleMeResponse no names found');
    }
  }

  getOtherConnections = () => {
    // console.log('AddContactsFromGoogleButton getOtherConnections');
    const { gapi } = window;
    let { errorMessageFromGoogle } = this.state;
    const setEmail = new Set();
    const contacts = new Set();
    // console.log('gapi:', gapi);

    // Get current voter's name and email - Work in progress 2022-09
    gapi.client.people.people.get({
      resourceName: 'people/me',
      personFields: 'metadata,names,emailAddresses',
    }).then((response) => {
      // const others = response.result.otherContacts;
      console.log('people/me name request response.result:', response.result);
      this.processGooglePeopleMeResponse(response.result);
    }, (error) => {
      console.error('people.me error:');
      console.error(JSON.stringify(error, null, 2));
      if (error.message) {
        errorMessageFromGoogle += error.message;
      }
    });

    // Get "Other Contacts" list
    gapi.client.people.otherContacts.list({
      pageSize: 1000,
      readMask: 'metadata,names,emailAddresses',
    }).then((response) => {
      this.setState({ addContactsState: AddContactConsts.receivedContacts  });
      const others = response.result.otherContacts;
      console.log('people.otherContacts response received');
      // console.log('otherContacts:', response);
      for (let i = 0; i < others.length; i++) {
        const other = others[i];
        const person = {
          display_name: '',
          family_name: '',
          given_name: '',
          email: '',
          update_time: '',
          type: '',
          api_type: 'google',
        };
        if (other.emailAddresses && other.emailAddresses.length > 0) {
          const possible = other.emailAddresses[0].value.replace('<', '').replace('>', '');
          if (possible && !possible.includes(' ') && !possible.includes(',') && possible.includes('@')) {
            if (!setEmail.has(possible)) {
              setEmail.add(possible);
              person.email = possible;
              person.id = possible.replace('@', '-').replace('.', '-');
              person.selected = false;
            }
          }
        }
        if (other.names && other.names.length > 0) {
          person.display_name = other.names[0].displayName;
          person.family_name = other.names[0].familyName;
          person.given_name = other.names[0].givenName;
        }
        if (other.metadata && other.metadata.sources && other.metadata.sources.length) {
          person.type = other.metadata.sources[0].type;
          person.update_time = other.metadata.sources[0].updateTime;
        }

        if (person.email.length && person.display_name.length) {
          contacts.add(person);
        }
      }
      // console.log('contacts set from Google: ', contacts);
      if (contacts.size > 0) {
        const arrayOfSelectedContacts = [];
        contacts.forEach((contact) => {
          if (contact) {
            arrayOfSelectedContacts.push(contact);
          }
        });
        if (arrayOfSelectedContacts) {
          console.log('arrayOfSelectedContacts length:', arrayOfSelectedContacts.length);
        } else {
          console.log('arrayOfSelectedContacts undefined');
        }
        const fromGooglePeopleApi = true;
        if (arrayOfSelectedContacts.length > 0) {
          VoterActions.voterContactListSave(arrayOfSelectedContacts, fromGooglePeopleApi);
          this.setState({
            addContactsState: AddContactConsts.sendingContacts,
          });
        }
      } else if (contacts.size === 0) {
        console.log('noContactsFound, contacts.size === 0');
        this.setState({
          addContactsState: AddContactConsts.noContactsFound,
        });
      }
    }, (error) => {
      console.error('people.otherContacts getOtherConnections error trapping:');
      console.error(JSON.stringify(error, null, 2));
      if (error.message) {
        errorMessageFromGoogle += error.message;
      }
      this.setState({
        addContactsState: AddContactConsts.permissionDenied,
      });
    });
    // Sign out so the voter has the option to choose another account
    gapi.auth2.getAuthInstance().signOut();
    this.setState({
      errorMessageFromGoogle,
    });
  }

  initClient () {
    const { addContactsState } = this.state;
    let { errorMessageFromGoogle } = this.state;
    const { gapi } = window;
    const GOOGLE_PEOPLE_API_CLIENT_ID = webAppConfig.GOOGLE_PEOPLE_API_CLIENT_ID || '';
    const GOOGLE_PEOPLE_API_KEY = webAppConfig.GOOGLE_PEOPLE_API_KEY || '';
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'];
    const SCOPES = 'https://www.googleapis.com/auth/contacts.other.readonly';

    try {
      gapi.client.init({
        apiKey: GOOGLE_PEOPLE_API_KEY,
        clientId: GOOGLE_PEOPLE_API_CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      }).then(() => {
        // Listen for sign-in state changes.
        this.googleSignInListener = gapi.auth2.getAuthInstance().isSignedIn.listen(this.onGoogleSignIn);
        const signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        if (signedIn) {
          if (addContactsState !== AddContactConsts.initializedSignedIn) {
            this.setState({ addContactsState: AddContactConsts.initializedSignedIn });
          }
        } else if (addContactsState !== AddContactConsts.initializedSignedOut) {
          this.setState({ addContactsState: AddContactConsts.initializedSignedOut });
        }
      }, (error) => {
        console.error('initClient gapi.client.init error trapping');
        console.error(JSON.stringify(error, null, 2));
        if (error.message) {
          errorMessageFromGoogle += error.message;
        }
        gapi.auth2.getAuthInstance().signOut();
      });
    } catch (error) {
      console.log('initClient try/catch error: ', error);
      if (error) {
        errorMessageFromGoogle += `Error from Google: ${error}`;
      }
    }
    this.setState({
      errorMessageFromGoogle,
    });
  }

  render () {
    renderLog('AddContactsFromGoogleButton');  // Set LOG_RENDER_EVENTS to log all renders
    const { darkButton, labelText } = this.props; // labelText
    const label = labelText || isWebApp() ? 'Import contacts from Gmail' : 'Import contacts from this phone';
    const { addContactsState, errorMessageFromGoogle } = this.state;
    // console.log('render in AddContactsFromGoogleButton, addContactsState: ', addContactsState);
    const waitingForImportsActionToFinish = (addContactsState === AddContactConsts.requestingContacts) || (addContactsState === AddContactConsts.sendingContacts) || (addContactsState === AddContactConsts.receivedContacts);
    // const waitingForImportsActionToFinish = true;
    if (waitingForImportsActionToFinish) {
      return (
        <ButtonWrapper>
          <ImportingContacts>
            <CircularProgress />
            <div style={{ marginRight: '8px', marginTop: '12px' }}>
              Importing contacts...
            </div>
          </ImportingContacts>
        </ButtonWrapper>
      );
    } else {
      return (
        <AddContactsFromGoogleWrapper>
          {(addContactsState === AddContactConsts.permissionDenied && isWebApp()) && (
            <>
              <PermissionDeniedTitle>
                Please Grant Permission
              </PermissionDeniedTitle>
              <PermissionDeniedText>
                To allow importing, approve this question in the Google popup:
                <br />
                <strong>
                  &quot;See and download contact info...&quot;
                </strong>
                <br />
                (You may need to check the box on the right.)
                <br />
                Error message from Google:
                {' '}
                {errorMessageFromGoogle}
              </PermissionDeniedText>
            </>
          )}
          {(addContactsState === AddContactConsts.permissionDenied && isCordova()) && (
            <>
              <PermissionDeniedTitle>
                Sadly you clicked &quot;Don&apos;t Allow&quot;
              </PermissionDeniedTitle>
              <PermissionDeniedText>
                iOS only gives you once chance to approve contacts access per installation of an app.
                <br />
                To import your contacts, delete the WeVote app then download it again from the App Store.
                <br />
                Be sure to press the
                <strong> OK </strong>
                button in the
                <strong> &quot;WeVote Would Like to Access Your Contacts&quot; </strong>
                dialog.
              </PermissionDeniedText>
            </>
          )}
          {(addContactsState === AddContactConsts.noContactsFound) && (
            <NoContactsFoundText>
              {isWebApp() ?
                <span>No contacts found for that account. Please try signing into another Gmail account.</span> :
                <span>No contacts found for your AppleId. Press the &quot;Skip for now&quot; button below.</span>}
            </NoContactsFoundText>
          )}
          <ImportContactsLabelText>
            {label}
          </ImportContactsLabelText>
          {isWebApp() || isAndroid() ? (
            <GoogleButton
              id="addContactsFromGoogle"
              label="Sign in with Google"
              onClick={this.onButtonClickWebApp}
              type={darkButton ? 'dark' : 'light'}
            />
          ) : (
            <Button
              color="primary"
              onClick={this.onButtonClickIos}
              variant="outlined"
              hidden={false}
            >
              Import Apple Contacts
            </Button>
          )}
        </AddContactsFromGoogleWrapper>
      );
    }
  }
}
AddContactsFromGoogleButton.propTypes = {
  darkButton: PropTypes.bool,
  labelText: PropTypes.string,
};

const styles = () => ({
});

const AddContactsFromGoogleWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const ButtonWrapper = styled('div')`
  margin-bottom: 24px;
`;

const ImportingContacts = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 24px;
`;

const ImportContactsLabelText = styled('div')`
  font-weight: 600;
  margin-bottom: ${isCordova() ? '6px' : '4px'};
  text-align: center;
`;

const NoContactsFoundText = styled('div')`
  color: red;
  font-weight: 600;
  margin-bottom: 4px;
  text-align: center;
`;

const PermissionDeniedText = styled('div')`
  margin-bottom: 12px;
  text-align: center;
`;

const PermissionDeniedTitle = styled('div')`
  color: red;
  font-weight: 600;
  margin-bottom: 4px;
  text-align: center;
`;

export default withStyles(styles)(AddContactsFromGoogleButton);
