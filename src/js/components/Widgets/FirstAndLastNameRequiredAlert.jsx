import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles/index';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import SettingsWidgetFirstLastName from '../Settings/SettingsWidgetFirstLastName';

class FirstAndLastNameRequiredAlert extends Component {
  constructor (props) {
    super(props);
    this.state = {
      displayThisComponent: false,
      voterDisplayName: '',
    };
  }

  componentDidMount () {
    const voterDisplayName = VoterStore.getFirstPlusLastName();
    const voterDisplayNameExists = voterDisplayName !== '';
    this.setState({
      displayThisComponent: !voterDisplayNameExists,
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.displayThisComponent !== nextState.displayThisComponent) {
      return true;
    }
    if (this.state.voterDisplayName !== nextState.voterDisplayName) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    // console.log('FirstAndLastNameRequiredAlert.jsx onVoterStoreChange, voter: ', VoterStore.getVoter());
    const voterDisplayName = VoterStore.getFirstPlusLastName();
    // const voterDisplayNameExists = voterDisplayName !== '';
    this.setState({
      voterDisplayName,
    });
  }

  render () {
    renderLog('EnterFirstAndLastName');  // Set LOG_RENDER_EVENTS to log all renders
    const { displayThisComponent, voterDisplayName } = this.state;
    if (displayThisComponent) {
      return (
        <PrintWrapper id="firstAndLastNameRequiredAlert">
          <ParagraphStyled>
            {voterDisplayName ? (
              <Alert variant="success">
                Success! Invitations to your friends will be from
                {' '}
                &apos;
                {voterDisplayName}
                &apos;
                .
              </Alert>
            ) : (
              <ExplanationText>
                To invite friends, your name is required.
              </ExplanationText>
            )}
            <SettingsWidgetFirstLastName hideNameShownWithEndorsements />
          </ParagraphStyled>
        </PrintWrapper>
      );
    } else {
      return null;
    }
  }
}

const styles = ({
  iconRoot: {
    fontSize: 36,
    margin: 'auto 10px',
  },
});

const ExplanationText = styled.div`
  margin-bottom: 10px;
`;

const ParagraphStyled = styled.div`
  margin: 15px 15px;
  font-size: 16px;
  font-weight: normal;
`;

const PrintWrapper = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 16px;
  margin-bottom: 10px;
  background-color: white;
  background-clip: border-box;
  border: 2px solid #999;
  @media print {
    display: none;
  }
`;

export default withStyles(styles)(FirstAndLastNameRequiredAlert);
