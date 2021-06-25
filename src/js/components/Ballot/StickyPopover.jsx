import { withStyles, withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';


class StickyPopover extends Component {
  constructor (props) {
    super(props);
    this.state = { showPopover: false };
    this.attachRef = (target) => this.setState({ target });
    this.onClickTarget = this.onClickTarget.bind(this);
    this.onMouseEnterTarget = this.onMouseEnterTarget.bind(this);
    this.onMouseEnterPopover = this.onMouseEnterPopover.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.closePopover = this.closePopover.bind(this);
  }

  componentDidMount () {
    if (this.props.openPopoverByProp) {
      this.setState({ showPopover: true });
    }
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.openPopoverByProp) {
      this.setState({ showPopover: true });
    } else if (nextProps.closePopoverByProp) {
      this.setState({ showPopover: false });
    }
  }

  componentWillUnmount () {
    clearTimeout(this.enterTimeoutId);
    clearTimeout(this.leaveTimeoutId);
  }

  onMouseEnterTarget () {
    const { delay, openPopoverByProp } = this.props;
    if (openPopoverByProp) {
      // When manually opening Popover, turn off the mouse hover features
    } else if (delay) {
      clearTimeout(this.enterTimeoutId);
      this.enterTimeoutId = setTimeout(() => this.setState({ showPopover: true }), delay.show);
    }
  }

  onClickTarget () {
    const currentState = this.state.showPopover;
    this.setState({ showPopover: !currentState });
  }

  onMouseEnterPopover () {
    clearTimeout(this.leaveTimeoutId);
    this.setState({ showPopover: true });
  }

  onMouseLeave () {
    const { delay, openPopoverByProp } = this.props;
    if (openPopoverByProp) {
      // When manually opening Popover, turn off the mouse hover features
    } else if (delay) {
      clearTimeout(this.leaveTimeoutId);
      this.leaveTimeoutId = setTimeout(() => this.setState({ showPopover: false }), delay.hide);
    }
  }

  closePopover () {
    this.setState({ showPopover: false });
  }

  render () {
    renderLog('StickyPopover');  // Set LOG_RENDER_EVENTS to log all renders
    const { children, openOnClick, placement, popoverComponent, popoverId } = this.props;
    const { showPopover, target } = this.state;
    // console.log('StickyPopover render, showPopover:', showPopover);
    return (
      <>
        {openOnClick ? (
          React.Children.map(children, (child) => React.cloneElement(child, {
            ref: this.attachRef,
            onMouseEnter: this.onMouseEnterTarget,
            onMouseLeave: this.onMouseLeave,
            onClick: this.onClickTarget,
          }))
        ) : (
          React.Children.map(children, (child) => React.cloneElement(child, {
            ref: this.attachRef,
            onMouseEnter: this.onMouseEnterTarget,
            onMouseLeave: this.onMouseLeave,
          }))
        )}
        <Overlay
          show={showPopover}
          target={target}
          placement={placement}
          className="u-position-relative"
          flip={false}
        >
          <Popover
            id={popoverId}
            onMouseEnter={this.onMouseEnterPopover}
            onMouseLeave={this.onMouseLeave}
            className="u-z-index-5010"
          >
            {popoverComponent}
            {this.props.showCloseIcon && (
              <CloseIcon id="closeYourPersonalizedScorePopover">
                <span className="fas fa-times u-cursor--pointer" aria-hidden="true" onClick={this.closePopover} />
              </CloseIcon>
            )}
          </Popover>
        </Overlay>
      </>
    );
  }
}
StickyPopover.propTypes = {
  children: PropTypes.element.isRequired,
  closePopoverByProp: PropTypes.bool,
  delay: PropTypes.shape({
    show: PropTypes.number,
    hide: PropTypes.number,
  }),
  openOnClick: PropTypes.bool,
  openPopoverByProp: PropTypes.bool,
  placement: PropTypes.string,
  popoverComponent: PropTypes.node.isRequired,
  popoverId: PropTypes.string,
  showCloseIcon: PropTypes.bool,
};

const styles = () => ({
  popoverRoot: {
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
