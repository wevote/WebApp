import React, { Component } from "react";
import PropTypes from "prop-types";
import FriendsOnlyIndicator from "../Widgets/FriendsOnlyIndicator";
import { renderLog } from "../../utils/logging";

export default class YourPositionsVisibilityMessage extends Component {
  static propTypes = {
    positionList: PropTypes.array,
  };

  constructor (props) {
    super(props);
    this.state = {
      visibleToFriendsOnlyCount: 0,
      visibleToPublicCount: 0,
    };
  }

  componentDidMount () {
    // console.log("In BallotStatusMessage componentDidMount");
    let visibleToPublicCount = 0;
    let visibleToFriendsOnlyCount = 0;
    if (this.props.positionList) {
      this.props.positionList.forEach( onePosition => {
        if (onePosition.is_public_position) {
          visibleToPublicCount += 1;
        } else {
          visibleToFriendsOnlyCount += 1;
        }
      });
    }
    this.setState({
      visibleToFriendsOnlyCount: visibleToFriendsOnlyCount,
      visibleToPublicCount: visibleToPublicCount,
    });
  }
  componentWillReceiveProps (nextProps) {
    // console.log("BallotStatusMessage componentWillReceiveProps");
    let visibleToPublicCount = 0;
    let visibleToFriendsOnlyCount = 0;
    if (nextProps.positionList) {
      nextProps.positionList.forEach( onePosition => {
        if (onePosition.is_public_position) {
          visibleToPublicCount += 1;
        } else {
          visibleToFriendsOnlyCount += 1;
        }
      });
    }
    this.setState({
      visibleToFriendsOnlyCount: visibleToFriendsOnlyCount,
      visibleToPublicCount: visibleToPublicCount,
    });
  }

  render () {
    renderLog(__filename);

    let alertClass = "";

    if (this.state.visibleToPublicCount > 0 && this.state.visibleToFriendsOnlyCount > 0) {
      alertClass = "alert-danger";
      return <div className="u-margin-left-right--md u-stack--xs hidden-print">
        <div className={"alert " + alertClass}>
          You have {this.state.visibleToFriendsOnlyCount} {this.state.visibleToFriendsOnlyCount === 1 ? "position" : "positions" } only visible to We Vote friends <FriendsOnlyIndicator isFriendsOnly />,
          and {this.state.visibleToPublicCount} {this.state.visibleToPublicCount === 1 ? "position" : "positions" } visible to the public <FriendsOnlyIndicator isFriendsOnly={false} />.
        </div>
      </div>;
    } else if (this.state.visibleToFriendsOnlyCount > 0) {
      alertClass = "alert-danger";
      return <div className="u-margin-left-right--md u-stack--xs hidden-print">
        <div className={"alert " + alertClass}>
          You have {this.state.visibleToFriendsOnlyCount} {this.state.visibleToFriendsOnlyCount === 1 ? "position" : "positions" } only visible to We Vote friends <FriendsOnlyIndicator isFriendsOnly />.
          None of your positions are visible to the public <FriendsOnlyIndicator isFriendsOnly={false} />.
        </div>
      </div>;
    } else if (this.state.visibleToPublicCount > 0) {
      alertClass = "alert-success";
      return <div className="u-margin-left-right--md u-stack--xs hidden-print">
        <div className={"alert " + alertClass}>
          You have {this.state.visibleToPublicCount} {this.state.visibleToPublicCount === 1 ? "position" : "positions" } visible to the public <FriendsOnlyIndicator isFriendsOnly={false} />.
        </div>
      </div>;
    } else {
      return null;
    }
  }
}
