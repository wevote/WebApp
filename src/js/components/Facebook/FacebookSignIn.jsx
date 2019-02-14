import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { renderLog } from '../../utils/logging';
import FacebookActions from '../../actions/FacebookActions';

class FacebookSignIn extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.didClickFacebookSignInButton();
    }
  }

  didClickFacebookSignInButton () {
    FacebookActions.login();
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
