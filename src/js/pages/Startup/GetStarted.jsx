import { Box, Grid } from '@mui/material';
import React from 'react';
import styled from '@mui/material/styles/styled';
import { PageTitle } from '../../common/components/Style/stepDisplayStyles';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import { PageContentContainerGetStarted } from '../../components/Style/pageLayoutStyles';
import Congratulations from './Congratulations';
import ContactsTable from './ContactsTable';
import ImportContactsButton from './ImportContactsButton';
import { parseRawAppleContacts } from './parseRawAppleContacts';
import Reassurance from './Reassurance';
import SignIn from './SignIn';
import StartedState, { startedStateMessageService } from './StartedState';
import StartProgressIndicator from './StartProgressIndicator';


export default class GetStarted extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      appleContacts: [],
    };
    this.handleRawContacts = this.handleRawContacts.bind(this);
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onStartedStateChange();
    this.startedStateSubscription = startedStateMessageService.getMessage().subscribe((msg) => this.onStartedStateChange(msg));
    window.scrollTo(0, 0);
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter && voter.is_signed_in;
    StartedState.setAllCheckedStateFalse();

    if (voterIsSignedIn) {
      StartedState.setIsSignedIn();
    } else {
      StartedState.setDisplayState(1);
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  handleRawContacts (conslist) {
    // TODO Dec 7, 2021:  plugin does not ask for address, but I could modify the swift code and try:  https://github.com/EinfachHans/cordova-plugin-contacts-x/blob/master/src/ios/ContactsX.swift
    // https://developer.apple.com/forums/thread/131417
    const cleanedAppleContacts = parseRawAppleContacts(conslist);
    this.setState({ appleContacts: cleanedAppleContacts });
    StartedState.setImportButtonPressed();
    console.log(cleanedAppleContacts);
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter && voter.is_signed_in;
    if (voterIsSignedIn) {
      StartedState.setIsSignedIn();
    }
    this.setState({});
  }

  onStartedStateChange (message) {
    console.log('onStartedStateChange triggered', message);
    this.setState({});
  }

  render () {
    renderLog('GetStarted');  // Set LOG_RENDER_EVENTS to log all renders
    const { appleContacts } = this.state;
    const displayState = StartedState.getDisplayState();
    const startedStateArray = StartedState.getStartedStateArray();
    console.log('GetStarted displayState', displayState, startedStateArray);

    return (
      <PageContentContainerGetStarted>
        <GetStartedWrapper>
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <PageTitle>Get Started With We Vote</PageTitle>
          </Grid>
          <StartProgressIndicator startedStateArray={startedStateArray} />
          <SignIn displayState={displayState} />
          <Box textAlign="center">
            <ImportContactsButton displayState={displayState} handleRawContacts={this.handleRawContacts} />
            <ContactsTable contacts={appleContacts} displayState={displayState} />
            <Congratulations displayState={displayState} />
          </Box>
          <Reassurance displayState={displayState} />
        </GetStartedWrapper>
      </PageContentContainerGetStarted>
    );
  }
}
const GetStartedWrapper = styled('div')`
  background-color: white;
  padding: 80px 20px 150% 20px;
`;

