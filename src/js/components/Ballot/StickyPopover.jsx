import React, { Component } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
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
  };

  constructor (props) {
    super(props);
    this.state = { showPopover: false };
    this.attachRef = target => this.setState({ target });
    this.onMouseEnterTarget = this.onMouseEnterTarget.bind(this);
    this.onMouseEnterPopover = this.onMouseEnterPopover.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnterTarget () {
    const { delay } = this.props;
    this.enterTimeoutId = setTimeout(() => this.setState({ showPopover: true }), delay.show);
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

  render () {
    const { popoverComponent, children, placement, popoverId } = this.props;
    const { showPopover, target } = this.state;
    renderLog(__filename);
    return (
      <React.Fragment>
        {React.Children.map(children, child => React.cloneElement(child, {
          ref: this.attachRef,
          onMouseEnter: this.onMouseEnterTarget,
          onMouseLeave: this.onMouseLeave,
        }))}
        <Overlay
          show={showPopover}
          target={target}
          placement={placement}
        >
          <Popover
            onMouseEnter={this.onMouseEnterPopover}
            onMouseLeave={this.onMouseLeave}
            id={popoverId || undefined}
          >
            {popoverComponent}
          </Popover>
        </Overlay>

      </React.Fragment>
    );
  }
}

export default StickyPopover;
