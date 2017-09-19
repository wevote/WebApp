import React, { Component, PropTypes } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

export default class ItemSupportOpposeCounts extends Component {
  static propTypes = {
    supportProps: PropTypes.object,
    guideProps: PropTypes.array,
    isModal: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      supportProps: this.props.supportProps,
      guideProps: this.props.guideProps,
    };
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      supportProps: nextProps.supportProps,
      guideProps: nextProps.guideProps,
    });
  }

  percentageMajority () {
    const { support_count, oppose_count } = this.state.supportProps;
    return Math.round(100 * Math.max(support_count, oppose_count) / (support_count + oppose_count));
  }

  render () {
    if (this.state.supportProps === undefined) {
      return null;
    }

    let { support_count, oppose_count, is_support, is_oppose } = this.state.supportProps;
    if (support_count === undefined || oppose_count === undefined || is_support === undefined || is_oppose === undefined) {
      return null;
    }

    let bar_style = {
      width: this.percentageMajority() + "%"
    };

    let empty_bar_style = {
      borderWidth: "0",
      width: "100%",
    };

    let is_empty = support_count === 0 && oppose_count === 0;
    let is_support_and_oppose = support_count !== 0 && oppose_count !== 0;
    let is_majority_support = support_count >= oppose_count;

    let background_bar_class_name;
    if (is_support_and_oppose && is_majority_support) {
      // If there are both support and oppose positions, change the color of the bar background to the minority position
      background_bar_class_name = "network-positions__bar-well red-bar";
    } else if (is_support_and_oppose && !is_majority_support) {
      // If there are both support and oppose positions, change the color of the bar background to the minority position
      background_bar_class_name = "network-positions__bar-well green-bar";
    } else {
      background_bar_class_name = "network-positions__bar-well";
    }

    let supportOpposePopoverText = "This is a summary of the “support” and “oppose” positions from your network.";
    if (!this.props.isModal) {
      supportOpposePopoverText += "Click to see who supports and who opposes this ballot item, and any other organizations you can follow";
    }
    const supportOpposePopoverTooltip = <Tooltip id="supportOpposeTooltip">{supportOpposePopoverText}</Tooltip>;

    let nonSupportOpposePopoverText = "This will show a summary of the “support” and “oppose” positions from your network once you have followed any voter guides that have positions on this ballot item.";
    if (!this.props.isModal) {
      nonSupportOpposePopoverText += "Click to see organizations you can follow that have positions on this ballot item";
    }
    const nonSupportOpposePopoverTooltip = <Tooltip id="nonSupportOpposeTooltip">{nonSupportOpposePopoverText}</Tooltip>;

    return <div className={ this.state.guideProps && this.state.guideProps.length && is_empty ? "hidden-xs hidden-print network-positions" : "network-positions" }>
      {/* <div className="network-positions__bar-label">
       { !is_empty ?
       "Positions in your network" :
       "No positions in your network"
       }
       </div> */}
      <div className="network-positions__support">
        <img src={ !is_empty && is_majority_support ? "/img/global/icons/up-arrow-color-icon.svg" : "/img/global/icons/up-arrow-gray-icon.svg" } className="network-positions__support-icon u-push--xs" width="20" height="20" />
        <div className="network-positions__count">
          { !is_empty ? support_count : null }
          <span className="sr-only"> Support</span>
        </div>
      </div>
      {is_empty ?
        <div className={background_bar_class_name}>
          <OverlayTrigger placement="top" overlay={nonSupportOpposePopoverTooltip}>
            <div className="network-positions__bar" style={ !is_empty ? bar_style : empty_bar_style } >
              <span className="sr-only">Empty position bar</span>
            </div>
          </OverlayTrigger>
        </div> :
        <div className={background_bar_class_name}>
          <OverlayTrigger placement="top" overlay={supportOpposePopoverTooltip}>
            <div className={ is_majority_support ?
              "network-positions__bar network-positions__bar--majority network-positions__bar--support" :
              "network-positions__bar network-positions__bar--majority network-positions__bar--oppose" }
                 style={ !is_empty ? bar_style : empty_bar_style }>
              <span className="sr-only">{this.percentageMajority()}% Supports</span>
            </div>
          </OverlayTrigger>
        </div>
      }

      <div className="network-positions__oppose">
        <div className="network-positions__count u-push--xs">
          { !is_empty ? oppose_count : null }
          <span className="sr-only"> Oppose</span>
        </div>
        <img src={ !is_empty && !is_majority_support ? "/img/global/icons/down-arrow-color-icon.svg" : "/img/global/icons/down-arrow-gray-icon.svg" } className="network-positions__oppose-icon" width="20" height="20" />
      </div>
    </div>;
  }
}
