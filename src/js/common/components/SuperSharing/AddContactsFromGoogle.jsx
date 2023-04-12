import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { loadGapiInsideDOM } from 'gapi-script';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import VoterActions from '../../../actions/VoterActions';
import { renderLog } from '../../utils/logging';
import webAppConfig from '../../../config'; // eslint-disable-line import/no-cycle
import AddContactConsts from '../../constants/AddContactConsts';
import VoterStore from '../../../stores/VoterStore';


class AddContactsFromGoogle extends Component {
  constructor (props) {
    super(props);

    this.state = {
      addContactsState: AddContactConsts.uninitialized,
      setOfContacts: new Set(),
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    loadGapiInsideDOM().then(() => {
      console.log('loadGapiInsideDOM onload');
      window.gapi.load('client:auth2', this.initClient.bind(this));
    });
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
    console.log('onGoogleSignIn 1 >>>>>>>> ', addContactsState);
    if (addContactsState === AddContactConsts.requestingSignIn && signedIn) {
      this.setState({ addContactsState: AddContactConsts.requestingContacts });
      // console.log('Getting contacts from Google after signIn');
      this.getOtherConnections();
    } else if (addContactsState === AddContactConsts.requestingSignIn && !signedIn) {
      console.log('Google signIn failed');
      this.setState({ addContactsState: AddContactConsts.initializedSignedOut });
    } else if (addContactsState === AddContactConsts.uninitialized) {
      this.setState({ addContactsState: signedIn ? AddContactConsts.initializedSignedIn : AddContactConsts.initializedSignedOut });
    }
  }

  onVoterStoreChange () {
    const { googleContactsStored } = VoterStore.getState();
    const { addContactsState } = this.state;
    if (addContactsState === AddContactConsts.sendingContacts) {
      if (googleContactsStored && googleContactsStored > 0) {
        console.log('onVoterStoreChange googleContactsStored:', googleContactsStored);
        this.setState({ addContactsState: AddContactConsts.savedContacts });
      } else {
        console.log('onVoterStoreChange voterContactListSave failed');
        this.setState({ addContactsState: AddContactConsts.initializedSignedIn });
      }
    }
  }

  onButtonClick = () => {
    const { addContactsState, setOfContacts } = this.state;
    const { gapi } = window;
    const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    if (isSignedIn) {
      // console.log('Getting contacts from Google on button click, since we were logged into Google');
      this.getOtherConnections();
      this.setState({ addContactsState: AddContactConsts.requestingContacts });
    } else {
      // console.log('Getting Auth from Google on button click, since we were not logged into Google');
      gapi.auth2.getAuthInstance().signIn();
      this.setState({ addContactsState: AddContactConsts.requestingSignIn });
    }

    if (addContactsState === AddContactConsts.receivedContacts) {
      // console.log('Sending contacts from Google to the API Server on button click');
      const arrayOfSelectedContacts = [];
      setOfContacts.forEach((contact) => {
        if (contact.selected) {
          arrayOfSelectedContacts.push(contact);
        }
      });

      const fromGooglePeopleApi = true;
      VoterActions.voterContactListSave(arrayOfSelectedContacts, fromGooglePeopleApi);
      this.setState({
        addContactsState: AddContactConsts.sendingContacts,
      });
    }
  }

  getOtherConnections = () => {
    const { gapi } = window;
    const setEmail = new Set();
    const contacts = new Set();
    gapi.client.people.otherContacts.list({
      pageSize: 1000,
      readMask: 'metadata,names,emailAddresses',
    }).then((response) => {
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
        VoterActions.voterContactListSave(arrayOfSelectedContacts, fromGooglePeopleApi);
      }
      this.setState({ setOfContacts: contacts });
      this.setState({ addContactsState: AddContactConsts.receivedContacts  });
    });
  }

  initClient () {
    const { gapi } = window;
    const GOOGLE_PEOPLE_API_CLIENT_ID = webAppConfig.GOOGLE_PEOPLE_API_CLIENT_ID || '';
    const GOOGLE_PEOPLE_API_KEY = webAppConfig.GOOGLE_PEOPLE_API_KEY || '';
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'];
    const SCOPES = 'https://www.googleapis.com/auth/contacts.other.readonly';

    gapi.client.init({
      apiKey: GOOGLE_PEOPLE_API_KEY,
      clientId: GOOGLE_PEOPLE_API_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    }).then(() => {
      // Listen for sign-in state changes.
      this.googleSignInListener = gapi.auth2.getAuthInstance().isSignedIn.listen(this.onGoogleSignIn);
      const signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      this.setState({ addContactsState: signedIn ? AddContactConsts.initializedSignedIn : AddContactConsts.initializedSignedOut });
    }, (error) => {
      console.error(JSON.stringify(error, null, 2));
    });
  }

  render () {
    renderLog('AddContactsFromGoogle');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, darkButton, mobileMode, voterContactEmailGoogleCount } = this.props;
    const { addContactsState } = this.state;
    // console.log('render in AddContactsFromGoogle, addContactsState: ', addContactsState);
    const disableButton = (addContactsState === AddContactConsts.requestingContacts) || (addContactsState === AddContactConsts.sendingContacts);

    return (
      <div>
        <Button
          classes={mobileMode ? { root: classes.buttonMobile } : { root: classes.buttonDesktop }}
          color="primary"
          disabled={disableButton}
          id="addContactsFromGoogle"
          variant={darkButton ? 'contained' : 'outlined'}
          onClick={this.onButtonClick}
        >
          <span>
            {disableButton ? (
              <span>
                Loading contacts...
              </span>
            ) : (
              <span>
                {voterContactEmailGoogleCount > 0 ? (
                  <span>
                    Update contacts from Google
                  </span>
                ) : (
                  <span>
                    Add contacts from Google
                  </span>
                )}
              </span>
            )}
          </span>
        </Button>
      </div>
    );
  }
}
AddContactsFromGoogle.propTypes = {
  classes: PropTypes.object,
  darkButton: PropTypes.bool,
  mobileMode: PropTypes.bool,
  voterContactEmailGoogleCount: PropTypes.number,
};

const styles = () => ({
  buttonMobile: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonMobileCordova: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '35px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonDesktop: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    minWidth: 300,
  },
});

export default withStyles(styles)(AddContactsFromGoogle);
