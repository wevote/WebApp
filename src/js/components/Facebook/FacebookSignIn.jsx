import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import AppActions from '../../actions/AppActions';
import FacebookActions from '../../actions/FacebookActions';

class FacebookSignIn extends Component {
  static propTypes = {
    toggleSignInModal: PropTypes.func,
    buttonText: PropTypes.string,
    classes: PropTypes.object,
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
    const { classes, buttonText } = this.props;
    return (
      <Tooltip
        title={buttonText}
      >
        <Fab
          classes={{ root: classes.fabRoot }}
          onClick={this.didClickFacebookSignInButton}
          onKeyDown={this.onKeyDown}
        >
          <span className="fab fa-facebook-square" />
        </Fab>
      </Tooltip>
    );
  }
}

const styles = ({
  fabRoot: {
    background: '#3b5998',
    fontSize: '1.5em',
    color: 'white',
    margin: 'auto 8px',
    '&:hover': {
      background: '#2d4373',
    },
  },
});

export default withStyles(styles)(FacebookSignIn);
