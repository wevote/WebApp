import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { renderLog } from '../../utils/logging';
import AppActions from '../../actions/AppActions';
import FacebookActions from '../../actions/FacebookActions';

class FacebookSignIn extends Component {
  static propTypes = {
    toggleSignInModal: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
    };

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
    return (
      <Button
        bsPrefix={this.props.className ? this.props.className : 'btn btn-social btn-facebook'}
        onClick={this.didClickFacebookSignInButton}
        onKeyDown={this.onKeyDown}
      >
        <span className="fa fa-facebook" />
        {' '}
        {this.props.buttonText ? this.props.buttonText : 'Sign In'}
      </Button>
    );
  }
}

FacebookSignIn.propTypes = {
  buttonText: PropTypes.string,
  className: PropTypes.string,
};

export default FacebookSignIn;
