import React, { Component } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';

class StickyPopover extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    classes: PropTypes.object,
    delay: PropTypes.shape({
      show: PropTypes.number,
      hide: PropTypes.number,
    }),
    openOnClick: PropTypes.bool,
    placement: PropTypes.string,
    popoverComponent: PropTypes.node.isRequired,
    popoverId: PropTypes.string,
    showCloseIcon: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = { showPopover: false };
    this.attachRef = target => this.setState({ target });
    this.onClickTarget = this.onClickTarget.bind(this);
    this.onMouseEnterTarget = this.onMouseEnterTarget.bind(this);
    this.onMouseEnterPopover = this.onMouseEnterPopover.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.closePopover = this.closePopover.bind(this);
  }

  componentWillUnmount () {
    if (this.enterTimeoutId) {
      clearTimeout(this.enterTimeoutId);
      this.enterTimeoutId = null;
    }
    if (this.leaveTimeoutId) {
      clearTimeout(this.leaveTimeoutId);
      this.leaveTimeoutId = null;
    }
  }

  onMouseEnterTarget () {
    const { delay } = this.props;
    this.enterTimeoutId = setTimeout(() => this.setState({ showPopover: true }), delay.show);
  }

  onClickTarget () {
    const currentState = this.state.showPopover;
    this.setState({ showPopover: !currentState });
  }

  onMouseEnterPopover () {
    if (this.leaveTimeoutId) {
      clearTimeout(this.leaveTimeoutId);
    }
    this.setState({ showPopover: true });
  }

  onMouseLeave () {
    const { delay } = this.props;
    if (this.enterTimeoutId) {
      clearTimeout(this.enterTimeoutId);
    }
    this.leaveTimeoutId = setTimeout(() => this.setState({ showPopover: false }), delay.hide);
  }

  closePopover () {
    this.setState({ showPopover: false });
  }

  render () {
    renderLog('StickyPopover');  // Set LOG_RENDER_EVENTS to log all renders
    const { children, classes, placement, popoverComponent, popoverId } = this.props;
    const { showPopover, target } = this.state;
    // console.log('StickyPopover render, showPopover:', showPopover);
    return (
      <React.Fragment>
        {this.props.openOnClick ? (
          React.Children.map(children, child => React.cloneElement(child, {
            ref: this.attachRef,
            onMouseEnter: this.onMouseEnterTarget,
            onMouseLeave: this.onMouseLeave,
            onClick: this.onClickTarget,
          }))
        ) : (
          React.Children.map(children, child => React.cloneElement(child, {
            ref: this.attachRef,
            onMouseEnter: this.onMouseEnterTarget,
            onMouseLeave: this.onMouseLeave,
          }))
        )}
        <Overlay
          show={showPopover}
          target={target}
          placement={placement}
          classes={{ root: classes.popoverRoot }}
          className="u-position-relative u-z-index-5000"
        >
          <Popover
            id={popoverId}
            onMouseEnter={this.onMouseEnterPopover}
            onMouseLeave={this.onMouseLeave}
          >
            {popoverComponent}
            {this.props.showCloseIcon && (
              <CloseIcon>
                <span className="fas fa-times u-cursor--pointer" aria-hidden="true" onClick={this.closePopover} />
              </CloseIcon>
            )}
          </Popover>
        </Overlay>

      </React.Fragment>
    );
  }
}
const styles = () => ({
  popoverRoot: {
    zIndex: 5000,
  },
});

const CloseIcon = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 15px;
  height: 15px;
  * {
    width: 100%;
  }
  color: white;
`;

export default withTheme(withStyles(styles)(StickyPopover));
