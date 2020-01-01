import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/esm/Button';
import { Menu, MenuItem } from '@material-ui/core/esm';
import { withStyles } from '@material-ui/core/esm/styles';
import styled from 'styled-components';

class BallotShareButton extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {

    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  shouldComponentUpdate (nextState) {
    if (this.state.open !== nextState.open) return true;
    if (this.state.anchorEl !== nextState.anchorEl) return true;
    return false;
  }

  handleClick (event) {
    this.setState({ anchorEl: event.currentTarget, open: true });
  }

  handleClose () {
    this.setState({ anchorEl: null, open: false });
  }

  render () {
    const { classes } = this.props;
    const { anchorEl } = this.state;

    return (
      <>
        <Button aria-controls="share-menu" onClick={this.handleClick} aria-haspopup="true" className={classes.button} variant="outlined" color="primary">
          <Icon>
            <i className="fas fa-share" />
          </Icon>
          Share
        </Button>
        <Menu
          id="share-menu"
          open={this.state.open}
          onClose={this.handleClose}
          elevation={1}
          getContentAnchorEl={null}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            horizontal: 'right',
          }}
          className={classes.menu}
        >
          <MenuItem>Ballot</MenuItem>
          <MenuItem>My Choices & Opinions</MenuItem>
        </Menu>
      </>
    );
  }
}

const styles = () => ({
  button: {
    padding: '0 12px',
  },
  menu: {
    borderRadius: '2px !important',
  }
});

const Icon = styled.span`
  margin-right: 4px;
`;

export default withStyles(styles)(BallotShareButton);
