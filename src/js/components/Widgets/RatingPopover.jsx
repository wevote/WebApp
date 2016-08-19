import React, { Component, PropTypes } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

export default class RatingPopover extends Component {
  static propTypes = {
    params: PropTypes.object,
    id: PropTypes.string,
    placement: PropTypes.string
  };

  constructor (props, context) {
    super(props, context);
    this.state = {show: false};
  }

  openPopover () {
    this.setState = {show: true};
  }

  closePopover () {
    this.setState = {show: false};
  }


  render () {
    const popoverClickRootClose =
      <Popover id="popover-trigger-click-root-close" title="Popover top">
        Ratings are given by the organization, and collected by the nonprofit Vote Smart.
        (down arrow icon) 0% is a low score, and (up arrow icon) 100% is a high score.
        Ratings can be invaluable in showing where an incumbent has stood on a series of votes in the past one or two years, especially when ratings by groups on all sides of an issue are compared. Some groups select votes that tend to favor members of one political party over another, rather than choosing votes based solely on issues concerns. Please visit the group's website or call 1-888-VOTESMART for more specific information.
      </Popover>
    ;

    return <OverlayTrigger trigger="click" rootClose placement="top" overlay={popoverClickRootClose} />
      ;
    }
  }
