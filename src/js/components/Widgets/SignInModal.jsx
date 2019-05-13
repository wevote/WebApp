import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import SettingsAccount from '../Settings/SettingsAccount';
import VoterStore from '../../stores/VoterStore';

class SignInModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // When this modal is opened, set a cookie with the current path (done in Application.js)
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    const { voter } = this.state;
    if (!this.state.voter) {
      return <div className="undefined-props" />;
    }

    // This modal is shown when the voter wants to sign in.
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(); }}
      >
        <DialogTitle>
          <div className="text-center">Sign In</div>
        </DialogTitle>
        <DialogContent>
          <section>
            <div className="text-center">
              {voter && voter.is_signed_in ? (
                <div>
                  <div className="u-f2">You are already signed in.</div>
                </div>
              ) : (
                <div>
                  { !this.state.voter.is_signed_in ?
                    (
                      <SettingsAccount
                        toggleSignInModal={this.props.toggleFunction}
                      />
                    ) :
                    null }
                </div>
              )}
            </div>
          </section>
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
  },
});

export default withStyles(styles)(SignInModal);
