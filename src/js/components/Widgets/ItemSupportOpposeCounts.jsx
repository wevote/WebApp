import React, { Component, PropTypes } from "react";

export default class ItemSupportOpposeCounts extends Component {
  static propTypes = {
    supportProps: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = { supportProps: this.props.supportProps };
  }

  componentWillReceiveProps (nextProps){
    this.setState({supportProps: nextProps.supportProps});
  }

  percentageMajority (){
    const {support_count, oppose_count} = this.state.supportProps;
    return Math.round(100 * Math.max(support_count, oppose_count) / (support_count + oppose_count));
  }

  render () {
    if (this.state.supportProps === undefined){
      return null;
    }

    var {support_count, oppose_count, is_support, is_oppose } = this.state.supportProps;
    if (support_count === undefined || oppose_count === undefined || is_support === undefined || is_oppose === undefined){
      return null;
    }

    var barStyle = {
      width: this.percentageMajority() + "%"
    };

    var emptyBarStyle = {
      borderWidth: "0"
    };

    var isEmpty = support_count === 0 && oppose_count === 0;

    var isSupportAndOppose = support_count !== 0 && oppose_count !== 0;

    var isMajoritySupport = support_count >= oppose_count;

    var backgroundBarClassName;
    if (isSupportAndOppose && isMajoritySupport) {
      // If there are both support and oppose positions, change the color of the bar background to the minority position
      backgroundBarClassName = "network-positions__bar-well red-bar";
    } else if (isSupportAndOppose && !isMajoritySupport) {
      // If there are both support and oppose positions, change the color of the bar background to the minority position
      backgroundBarClassName = "network-positions__bar-well green-bar";
    } else {
      backgroundBarClassName = "network-positions__bar-well";
    }

    return <div className="network-positions">
      <div className="network-positions__bar-label">
        {!isEmpty ?
          "Positions in your network" :
          "No positions in your network"
        }
      </div>
      <div className="network-positions__support">
        <img src={!isEmpty && isMajoritySupport ? "/img/global/icons/up-arrow-color-icon.svg" : "/img/global/icons/up-arrow-gray-icon.svg"} className="network-positions__support-icon" width="20" height="20" />
        <div className="network-positions__count">
          {!isEmpty ? support_count : null}
          <span className="sr-only"> Support</span>
        </div>
      </div>
      <div className={backgroundBarClassName}>
        { isMajoritySupport ?
          <div className="network-positions__bar network-positions__bar--majority network-positions__bar--support" style={!isEmpty ? barStyle : emptyBarStyle}>
            <span className="sr-only">{this.percentageMajority()}% Supports</span>
          </div> :
          <div className="network-positions__bar network-positions__bar--majority network-positions__bar--oppose" style={!isEmpty ? barStyle : emptyBarStyle}>
            <span className="sr-only">{this.percentageMajority()}% Supports</span>
          </div>
        }
      </div>

      <div className="network-positions__oppose">
        <img src={!isEmpty && !isMajoritySupport ? "/img/global/icons/down-arrow-color-icon.svg" : "/img/global/icons/down-arrow-gray-icon.svg"} className="network-positions__oppose-icon" width="20" height="20" />
        <div className="network-positions__count">
          {!isEmpty ? oppose_count : null}
          <span className="sr-only"> Oppose</span>
        </div>
      </div>
    </div>;
  }
}
