import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

class MaterialUIPopover extends Component {
  static propTypes = {
    children: PropTypes.object,
    classes: PropTypes.object,
    controlAdviserMaterialUIPopoverFromProp: PropTypes.bool,
    externalUniqueId: PropTypes.string,
    openAdviserMaterialUIPopover: PropTypes.bool,
    popoverDisplayObject: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      anchorEl: null,
      showPopover: false,
    };
  }

  componentDidMount () {
    // console.log('MaterialUIPopover componentDidMount');
    this.setAnchorElementManually();
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.controlAdviserMaterialUIPopoverFromProp !== nextProps.controlAdviserMaterialUIPopoverFromProp) {
      return true;
    }
    if (this.props.externalUniqueId !== nextProps.externalUniqueId) {
      return true;
    }
    if (this.props.openAdviserMaterialUIPopover !== nextProps.openAdviserMaterialUIPopover) {
      return true;
    }
    if (this.state.anchorEl !== nextState.anchorEl) {
      return true;
    }
    if (this.state.showPopover !== nextState.showPopover) {
      return true;
    }
    return false;
  }

  componentDidUpdate () {
    // console.log('MaterialUIPopover componentDidUpdate');
    this.setAnchorElementManually();
  }

  setAnchorElementManually = () => {
    const { controlAdviserMaterialUIPopoverFromProp, externalUniqueId, openAdviserMaterialUIPopover } = this.props;
    const { anchorEl, showPopover } = this.state;
    // console.log('MaterialUIPopover setAnchorElementManually, openAdviserMaterialUIPopover:', openAdviserMaterialUIPopover);
    if (controlAdviserMaterialUIPopoverFromProp && openAdviserMaterialUIPopover) {
      if (!(anchorEl)) {
        const anchorElement = document.querySelector(`#materialUIPopover-AnchorElement-${externalUniqueId}`);
        // console.log('openAdviserMaterialUIPopover but no anchorEl, anchorElement found:', anchorElement);
        if (anchorElement) {
          this.setState({
            anchorEl: anchorElement,
            showPopover: true,
          });
        }
      }
    } else if (controlAdviserMaterialUIPopoverFromProp && !openAdviserMaterialUIPopover && showPopover) {
      this.setState({
        showPopover: false,
      });
    }
  }

  handleClick = (event) => {
    // setAnchorEl(event.currentTarget);
    this.setState({
      anchorEl: event.currentTarget,
      showPopover: true,
    });
  };

  handleClose = () => {
    this.setState({
      // anchorEl: null,
      showPopover: false,
    });
  };

  render () {
    const { classes, externalUniqueId, controlAdviserMaterialUIPopoverFromProp, popoverDisplayObject } = this.props;
    const { anchorEl, showPopover } = this.state;

    // const open = Boolean(anchorEl) && Boolean(openAdviserMaterialUIPopover);
    const id = (showPopover || Boolean(controlAdviserMaterialUIPopoverFromProp)) ? 'simple-popover' : undefined;
    // console.log('controlAdviserMaterialUIPopoverFromProp:', controlAdviserMaterialUIPopoverFromProp, ', showPopover:', showPopover);
    // console.log('externalUniqueId:', externalUniqueId, ', id:', id);
    // console.log('anchorEl:', anchorEl);

    return (
      <div>
        <ClickWrapper aria-describedby={id} variant="contained" color="primary" id={`materialUIPopover-AnchorElement-${externalUniqueId}`} onClick={this.handleClick}>
          {this.props.children}
        </ClickWrapper>
        <Popover
          id={id}
          classes={{ paper: classes.popoverRoot }}
          className="u-z-index-5010"
          open={showPopover}
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
  popoverRoot: {
    border: '.5px solid #ccc',
    borderRadius: 7,
  },
  popoverTypography: {
    padding: 0,
  },
});

const ClickWrapper = styled.div`
`;

export default withTheme(withStyles(styles)(MaterialUIPopover));
