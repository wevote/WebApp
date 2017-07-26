import React, { Component, PropTypes } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

export default class EditAddressPopover extends Component {
  static propTypes = {
    placement: PropTypes.string.isRequired,
    popover_off: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  constructor (props, context) {
    super(props, context);
    this.closePopover = this.closePopover.bind(this);
  }

  closePopover () {
    this.refs.overlay.hide();
  }

  render () {
    const AddressPopover = <Popover id="popover-trigger-click-root-close"
      onClick={this.closePopover}>
      <div style={{textAlign: "center"}}>
        <p><span style={{color: "#ef1e26"}}>This is our best guess</span> <i className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></p>
        <p>Want to make sure these are your ballot items? Enter the full address where you are registered to vote.</p>
        <button className="btn btn-success" onClick={this.props.onClick}>Enter Address &gt;&gt;</button>
      </div>
    </Popover>;

    return (
      <span>{ this.props.popover_off ? <span className="position-rating__source">&nbsp;&nbsp;<i className="fa fa-exclamation-circle" aria-hidden="true" style={{color: "#fc0d1b"}} />&nbsp;&nbsp;</span> :
        <OverlayTrigger
          trigger="click"
          ref="overlay"
          onExit={this.closePopover}
          rootClose
          placement={this.props.placement}
          overlay={AddressPopover}>
          <span className="position-rating__source with-popover">&nbsp;&nbsp;<i className="fa fa-exclamation-circle" aria-hidden="true" style={{color: "#fc0d1b"}} />&nbsp;&nbsp;</span>
        </OverlayTrigger> }
      </span>
    );
  }
}
