import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Phone from '@material-ui/icons/Phone';
import InputBase from '@material-ui/core/InputBase';
import LoadingWheel from './LoadingWheel';
import { renderLog } from '../utils/logging';
import VoterActions from '../actions/VoterActions';
import VoterStore from '../stores/VoterStore';
// import {FormHelperText} from "@material-ui/core";

class VoterPhoneVerificationEntry extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      voterPhoneNumber: '',
    };

    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  onPhoneNumberChange (e) {
    this.setState({ voterPhoneNumber: e.target.value });
  }

  render () {
    renderLog(__filename);
    if (this.state.loading) {
      return LoadingWheel;
    }

    const { classes } = this.props;

    return (
      <Wrapper>
        <div className="u-stack--sm u-tl">
          <strong>
            Sign in with SMS phone number
          </strong>
          {' '}
          {/* enterEmailExplanation */}
        </div>
        <form className="form-inline">
          <Paper className={classes.root} elevation={1}>
            <Phone />
            <InputBase
              className={classes.input}
              type="phone"
              name="voter_phone_number"
              id="enterVoterPhone"
              placeholder="Type phone number here..."
              onChange={this.onPhoneNumberChange}
            />
          </Paper>
          <Button
            color="primary"
            id="voterPhoneSendSMS"
            variant="contained"
            className={classes.button}
          >
            SEND VERIFICATION CODE
          </Button>
        </form>
      </Wrapper>
    );
  }
}

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 8,
    marginBottom: 8,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    padding: 8,
  },
  button: {
    width: '100%',
    padding: '12px',
  },
};

const Wrapper = styled.div`
  margin-top: 32px;
`;

export default withStyles(styles)(VoterPhoneVerificationEntry);
