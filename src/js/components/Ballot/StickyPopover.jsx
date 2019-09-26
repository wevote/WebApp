import React, { Component } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';

class StickyPopover extends Component {
  static propTypes = {
    delay: PropTypes.shape({
      show: PropTypes.number,
      hide: PropTypes.number,
    }),
    children: PropTypes.element.isRequired,
    popoverComponent: PropTypes.node.isRequired,
    placement: PropTypes.string,
    popoverId: PropTypes.string,
    showCloseIcon: PropTypes.bool,
    openOnClick: PropTypes.bool,
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
    clearTimeout(this.enterTimeoutId);
    clearTimeout(this.leaveTimeoutId);
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
    const { popoverComponent, children, placement, popoverId } = this.props;
    const { showPopover, target } = this.state;
    renderLog(__filename);
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
          className="u-position-relative"
        >
          <Popover
            onMouseEnter={this.onMouseEnterPopover}
            onMouseLeave={this.onMouseLeave}
            id={popoverId}
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

export default StickyPopover;
