import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';
import AppActions from '../../actions/AppActions';
import FacebookActions from '../../actions/FacebookActions';
import { historyPush } from '../../utils/cordovaUtils';
import SplitIconButton from '../Widgets/SplitIconButton';

class FacebookSignIn extends Component {
  static propTypes = {
    closeSignInModal: PropTypes.func,
    buttonText: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onKeyDown = (event) => {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.didClickFacebookSignInButton();
    }
  };

  didClickFacebookSignInButton = () => {
    AppActions.unsetStoreSignInStartFullUrl();
    FacebookActions.login();
    historyPush('/facebook_sign_in');
  };

  closeSignInModalLocal = () => {
    if (this.props.closeSignInModal) {
      this.props.closeSignInModal();
    }
  };

  render () {
    renderLog('FacebookSignIn');  // Set LOG_RENDER_EVENTS to log all renders
    const { buttonText } = this.props;
    return (
      <SplitIconButton
        buttonText={buttonText}
        backgroundColor="#3b5998"
        externalUniqueId="facebookSignIn"
        icon={<span className="fab fa-facebook-square" />}
        onClick={this.didClickFacebookSignInButton}
        onKeyDown={this.onKeyDown}
        separatorColor="rgba(250, 250, 250, .6)"
      />
    );
  }
}

export default FacebookSignIn;
