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
    this.state = { showPopover: true };
    this.attachRef = target => this.setState({ target });
  }

  myAlert () {
    console.log('it worked!');
    this.setState({ showPopover: true });
  }

  render () {
    const { popoverComponent, children, placement } = this.props;
    const { showPopover, target } = this.state;
    renderLog(__filename);
    return (
      <React.Fragment>
        {React.Children.map(children, child => React.cloneElement(child, { ref: this.attachRef }))}
        <Overlay
          show={showPopover}
          target={target}
          placement={placement}
        >
          <Popover>
            {popoverComponent}
          </Popover>
        </Overlay>

      </React.Fragment>
    );
  }
}

export default StickyPopover;
