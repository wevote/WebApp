import { CircularProgress } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { loadGapiInsideDOM } from 'gapi-script';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import GoogleButton from 'react-google-button';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config'; // eslint-disable-line import/no-cycle
import AddContactConsts from '../../constants/AddContactConsts';
import VoterStore from '../../stores/VoterStore';


class AddContactsFromGoogleButton extends Component {
  constructor (props) {
    super(props);

    this.state = {
      addContactsState: AddContactConsts.uninitialized,
      // setOfContacts: new Set(),
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (isWebApp()) {
      loadGapiInsideDOM().then(() => {
        console.log('AddContactsFromGoogleButton loadGapiInsideDOM onload:');
        window.gapi.load('client:auth2', this.initClient.bind(this));
        console.log('AddContactsFromGoogleButton loadGapiInsideDOM after onload window.gapi:', window.gapi);
      });
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.googleSignInListener) {
      this.googleSignInListener.remove();
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
        console.log('Getting contacts from Google after signIn');
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

  onButtonClick = () => {
    // const { addContactsState, setOfContacts } = this.state;
    const { gapi } = window;
    // 2022-06-23 We always want to give the voter a chance to choose another account to import from
    const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    console.log('onButtonClick isSignedIn:', isSignedIn);
    if (isSignedIn) {
      // console.log('Getting contacts from Google on button click, since we were logged into Google');
      this.getOtherConnections();
      this.setState({ addContactsState: AddContactConsts.requestingContacts });
    } else {
      // console.log('Getting Auth from Google on button click, since we were not logged into Google');
      gapi.auth2.getAuthInstance().signIn();
      this.setState({ addContactsState: AddContactConsts.requestingSignIn });
    }

    // 2022-06-23 I think this creates duplicate voterContactListSave
    // if (addContactsState === AddContactConsts.receivedContacts) {
    //   // console.log('Sending contacts from Google to the API Server on button click');
    //   const arrayOfSelectedContacts = [];
    //   setOfContacts.forEach((contact) => {
    //     if (contact.selected) {
    //       arrayOfSelectedContacts.push(contact);
    //     }
    //   });
    //
    //   const fromGooglePeopleApi = true;
    //   if (arrayOfSelectedContacts.length > 0) {
    //     VoterActions.voterContactListSave(arrayOfSelectedContacts, fromGooglePeopleApi);
    //   }
    //   this.setState({
    //     addContactsState: AddContactConsts.sendingContacts,
    //   });
    // }
  }

  getOtherConnections = () => {
    // console.log('AddContactsFromGoogleButton getOtherConnections');
    const { gapi } = window;
    const setEmail = new Set();
    const contacts = new Set();
    gapi.client.people.otherContacts.list({
      pageSize: 1000,
      readMask: 'metadata,names,emailAddresses',
    }).then((response) => {
      this.setState({ addContactsState: AddContactConsts.receivedContacts  });
      const others = response.result.otherContacts;
      // console.log(others);
      for (let i = 0; i < others.length; i++) {
        const other = others[i];
        const person = {
          display_name: '',
          family_name: '',
          given_name: '',
          email: '',
          update_time: '',
          type: '',
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
        // console.log('arrayOfSelectedContacts:', arrayOfSelectedContacts);
        const fromGooglePeopleApi = true;
        if (arrayOfSelectedContacts.length > 0) {
          VoterActions.voterContactListSave(arrayOfSelectedContacts, fromGooglePeopleApi);
          this.setState({
            addContactsState: AddContactConsts.sendingContacts,
          });
        }
        // We don't want to stay signed in, in case the person wants to import from another gmail account
        gapi.auth2.getAuthInstance().signOut();
      } else if (contacts.size === 0) {
        // console.log('noContactsFound, contacts.size === 0');
        this.setState({
          addContactsState: AddContactConsts.noContactsFound,
        });
        // Since no contacts were found with this gmail account, sign out so the voter can choose another account
        gapi.auth2.getAuthInstance().signOut();
      }
    }, (error) => {
      console.error('getOtherConnections error trapping');
      console.error(JSON.stringify(error, null, 2));
      this.setState({
        addContactsState: AddContactConsts.permissionDenied,
      });
      gapi.auth2.getAuthInstance().signOut();
    });
  }

  initClient () {
    const { addContactsState } = this.state;
    const { gapi } = window;
    const GOOGLE_PEOPLE_API_CLIENT_ID = webAppConfig.GOOGLE_PEOPLE_API_CLIENT_ID || '';
    const GOOGLE_PEOPLE_API_KEY = webAppConfig.GOOGLE_PEOPLE_API_KEY || '';
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'];
    const SCOPES = 'https://www.googleapis.com/auth/contacts.other.readonly';
    // const REDIRECT_URI = isWebApp() ? window.location.href : 'https://wevote.us/';

    gapi.client.init({
      apiKey: GOOGLE_PEOPLE_API_KEY,
      clientId: GOOGLE_PEOPLE_API_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
      cookie_policy: 'https://wevote.us',
      plugin_name: 'WeVoteDummy',
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
      console.error('initClient error trapping');
      console.error(JSON.stringify(error, null, 2));
      gapi.auth2.getAuthInstance().signOut();
    });
  }

  cordovaSignOn () {
    const GOOGLE_PEOPLE_API_CLIENT_ID = webAppConfig.GOOGLE_PEOPLE_API_CLIENT_ID || '';
    // const GOOGLE_PEOPLE_API_KEY = webAppConfig.GOOGLE_PEOPLE_API_KEY || '';
    // const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'];
    const SCOPES = 'https://www.googleapis.com/auth/contacts.other.readonly';
    window.plugins.googleplus.login({
      scopes: SCOPES,
      webClientId: GOOGLE_PEOPLE_API_CLIENT_ID,
      offline: false, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    },
    (obj) => {
      alert(`Sign in Successful${JSON.stringify(obj)}`); // do something useful instead of alerting
    },
    (msg) => {
      alert(`Sign in error: ${msg}`);
    });
  }


  render () {
    renderLog('AddContactsFromGoogleButton');  // Set LOG_RENDER_EVENTS to log all renders
    const { darkButton, labelText } = this.props;
    const { addContactsState } = this.state;
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
          <Helmet>
            <meta property="Content-Security-Policy" content="frame-src https://content.googleapis.com/*; " />
          </Helmet>
          {(addContactsState === AddContactConsts.permissionDenied) && (
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
              </PermissionDeniedText>
            </>
          )}
          {(addContactsState === AddContactConsts.noContactsFound) && (
            <NoContactsFoundText>
              No contacts found for that account. Please try signing into another Gmail account.
            </NoContactsFoundText>
          )}
          <ImportContactsLabelText>
            {labelText || 'Check Gmail for contacts to import:'}
          </ImportContactsLabelText>
          <GoogleButton
            id="addContactsFromGoogle"
            label="Sign in with Google"
            onClick={isWebApp() ? this.onButtonClick : this.cordovaSignOn}
            type={darkButton ? 'dark' : 'light'}
          />
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
  margin-bottom: 4px;
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
