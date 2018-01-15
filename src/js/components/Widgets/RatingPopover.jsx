import React, { Component, PropTypes } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

export default class RatingPopover extends Component {
  static propTypes = {
    params: PropTypes.object,
    id: PropTypes.string,
    placement: PropTypes.string,
    popover_off: PropTypes.bool
  };

  constructor (props, context) {
    super(props, context);

    this.closePopover = this.closePopover.bind(this);
  }

  closePopover () {
    this.refs.overlay.hide();
  }

  render () {
    const voteSmartPopover =
      <Popover id="popover-trigger-click-root-close"
        title={<span>Ratings from Vote Smart <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
        onClick={this.closePopover}>
        Ratings are given by the organization, and collected by the
        nonprofit Vote Smart. <span className="u-no-break"><img src="/img/global/icons/down-arrow-color-icon.svg"
                                                                width="20" height="20" /> 0%</span> is a low score,
        and <span className="u-no-break"><img src="/img/global/icons/up-arrow-color-icon.svg"
                                          width="20" height="20" /> 100%</span> is a high score.
        Ratings can be invaluable in showing where an incumbent has stood
        on a series of votes. Some groups select votes that tend to favor
        members of one political party over another, rather than choosing
        votes based solely on issues. Please call 1-888-VOTESMART for
        more specific information.
      </Popover>;

    let popover_off = false;
    if (this.props.popover_off !== undefined) {
      popover_off = this.props.popover_off ? true : false;
    }
    let placement = "top";
    if (this.props.placement !== undefined) {
      placement = this.props.placement;
    }

    return <span> { popover_off ? <span className="position-rating__source">&nbsp;(source: VoteSmart.org)</span> :
        <OverlayTrigger
          trigger="click"
          ref="overlay"
          onExit={this.closePopover}
          rootClose
          placement={placement}
          overlay={voteSmartPopover}>
          <span className="position-rating__source with-popover">&nbsp;(source: VoteSmart.org)</span>
        </OverlayTrigger> }
      </span>
      ;
    }
  }
