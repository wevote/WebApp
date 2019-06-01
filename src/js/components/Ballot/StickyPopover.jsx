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
  };

  constructor (props) {
    super(props);
    this.state = { showPopover: false };
    this.attachRef = target => this.setState({ target });
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter () {
    const { delay } = this.props;
    setTimeout(() => this.setState({ showPopover: true }), delay.show);
  }

  onMouseLeave () {
    const { delay } = this.props;
    setTimeout(() => this.setState({ showPopover: false }), delay.hide);
  }

  render () {
    const { popoverComponent, children, placement } = this.props;
    const { showPopover, target } = this.state;
    renderLog(__filename);
    return (
      <React.Fragment>
        {React.Children.map(children, child => React.cloneElement(child, {
          ref: this.attachRef,
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.onMouseLeave,
        }))}
        <Overlay
          show={showPopover}
          target={target}
          placement={placement}
        >
          <Popover
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            {popoverComponent}
          </Popover>
        </Overlay>

      </React.Fragment>
    );
  }
}

export default StickyPopover;
