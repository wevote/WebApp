import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { cordovaDot } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";

export default class ItemSupportOpposeCounts extends Component {
  static propTypes = {
    guideProps: PropTypes.array,
    positionBarIsClickable: PropTypes.bool,
    supportProps: PropTypes.object,
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
    if (this.state.supportProps !== undefined) {
      const {support_count: supportCount, oppose_count: opposeCount} = this.state.supportProps;
      return supportCount + opposeCount > 0 ? Math.round(100 * Math.max(supportCount, opposeCount) / (supportCount + opposeCount)) : 0;
    }
    return 0;
  }

  render () {
    renderLog(__filename);
    if (this.state.supportProps === undefined) {
      return null;
    }

    let { support_count: supportCount, oppose_count: opposeCount, is_support: isSupport, is_oppose: isOppose } = this.state.supportProps;
    if (supportCount === undefined || opposeCount === undefined || isSupport === undefined || isOppose === undefined) {
      return null;
    }

    let barStyle = {
      width: this.percentageMajority() + "%",
    };

    let emptyBarStyle = {
      borderWidth: "0",
      width: "100%",
    };

    let isEmpty = supportCount === 0 && opposeCount === 0;
    let isSupportAndOppose = supportCount !== 0 && opposeCount !== 0;
    let isMajoritySupport = supportCount >= opposeCount;

    let backgroundBarClassName;
    if (isSupportAndOppose && isMajoritySupport) {
      // If there are both support and oppose positions, change the color of the bar background to the minority position
      backgroundBarClassName = "network-positions__bar-well red-bar";
    } else if (isSupportAndOppose && !isMajoritySupport) {
      // If there are both support and oppose positions, change the color of the bar background to the minority position
      backgroundBarClassName = "network-positions__bar-well green-bar";
    } else {
      backgroundBarClassName = "network-positions__bar-well";
    }

    let supportOpposePopoverText = "This is a summary of the “support” and “oppose” positions from your network.";
    if (!this.props.positionBarIsClickable) {
      supportOpposePopoverText += " Click to see more detail.";
    }

    const supportOpposePopoverTooltip = <Tooltip id="supportOpposeTooltip">{supportOpposePopoverText}</Tooltip>;

    let nonSupportOpposePopoverText = "This will show a summary of the “support” and “oppose” positions from your network.";
    if (!this.props.positionBarIsClickable) {
      nonSupportOpposePopoverText += " Click to see voter guides you can listen to.";
    }

    const nonSupportOpposePopoverTooltip = <Tooltip id="nonSupportOpposeTooltip">{nonSupportOpposePopoverText}</Tooltip>;

    return <div className={ this.state.guideProps && this.state.guideProps.length && isEmpty ? "d-none d-sm-block d-print-none network-positions" : "network-positions" }>
      {/* <div className="network-positions__bar-label">
       { !isEmpty ?
       "Positions in your network" :
       "No positions in your network"
       }
       </div> */}
      <div className="network-positions__support">
        <img src={ !isEmpty && isMajoritySupport ? cordovaDot("/img/global/icons/up-arrow-color-icon.svg") : cordovaDot("/img/global/icons/up-arrow-gray-icon.svg") }
             className="network-positions__support-icon u-push--xs" width="20" height="20" />
        <div className="network-positions__count">
          { !isEmpty ? supportCount : null }
          <span className="sr-only"> Support</span>
        </div>
      </div>
      {isEmpty ?
        <div className={backgroundBarClassName}>
          <OverlayTrigger container={this} placement="top" overlay={nonSupportOpposePopoverTooltip}>
            <div className="network-positions__bar" style={ !isEmpty ? barStyle : emptyBarStyle } >
              <span className="sr-only">Empty position bar</span>
            </div>
          </OverlayTrigger>
        </div> :
        <div className={backgroundBarClassName}>
          <OverlayTrigger container={this} placement="top" overlay={supportOpposePopoverTooltip}>
            <div className={ isMajoritySupport ?
              "network-positions__bar network-positions__bar--majority network-positions__bar--support" :
              "network-positions__bar network-positions__bar--majority network-positions__bar--oppose" }
                 style={ !isEmpty ? barStyle : emptyBarStyle }>
              <span className="sr-only">{this.percentageMajority()}% Supports</span>
            </div>
          </OverlayTrigger>
        </div>
      }

      <div className="network-positions__oppose">
        <div className="network-positions__count u-push--xs">
          { !isEmpty ? opposeCount : null }
          <span className="sr-only"> Oppose</span>
        </div>
        <img src={ !isEmpty && !isMajoritySupport ? cordovaDot("/img/global/icons/down-arrow-color-icon.svg") : cordovaDot("/img/global/icons/down-arrow-gray-icon.svg") }
             className="network-positions__oppose-icon" width="20" height="20" />
      </div>
    </div>;
  }
}
