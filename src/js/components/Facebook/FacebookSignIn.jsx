import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';
import AppActions from '../../actions/AppActions';
import FacebookActions from '../../actions/FacebookActions';
import ContainedIconButton from '../Twitter/ContainedIconButton';

class FacebookSignIn extends Component {
  static propTypes = {
    toggleSignInModal: PropTypes.func,
    buttonText: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentWillUnmount () {
    // Close the Sign In Modal
    this.toggleSignInModalLocal();
  }

  onKeyDown = (event) => {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.didClickFacebookSignInButton();
    }
  }

  didClickFacebookSignInButton = () => {
    AppActions.unsetStoreSignInStartPath();
    FacebookActions.login();
  }

  toggleSignInModalLocal = () => {
    if (this.props.toggleSignInModal) {
      this.props.toggleSignInModal();
    }
  }

  render () {
    renderLog(__filename);
    const { buttonText } = this.props;
    return (
      <ContainedIconButton
        buttonText={buttonText}
        color="#3b5998"
        icon={<span className="fab fa-facebook-square" />}
        onClick={this.didClickFacebookSignInButton}
        onKeyDown={this.onKeyDown}
      />
    );
  }
}

export default FacebookSignIn;
