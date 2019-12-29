import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/esm/styles';
import Popover from '@material-ui/core/esm/Popover';
import Typography from '@material-ui/core/esm/Typography';

class MaterialUIPopover extends Component {
  static propTypes = {
    children: PropTypes.object,
    classes: PropTypes.object,
    popoverDisplayObject: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  handleClick = (event) => {
    // setAnchorEl(event.currentTarget);
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    // setAnchorEl(null);
    this.setState({
      anchorEl: null,
    });
  };

  render () {
    const { classes, popoverDisplayObject } = this.props;
    const { anchorEl } = this.state;

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
      <div>
        <ClickWrapper aria-describedby={id} variant="contained" color="primary" onClick={this.handleClick}>
          {this.props.children}
        </ClickWrapper>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography className={classes.popoverTypography} component="div">
            {popoverDisplayObject}
          </Typography>
        </Popover>
      </div>
    );
  }
}

const styles = () => ({
  popoverTypography: {
    padding: 5,
  },
});

const ClickWrapper = styled.div`
`;

export default withTheme(withStyles(styles)(MaterialUIPopover));
