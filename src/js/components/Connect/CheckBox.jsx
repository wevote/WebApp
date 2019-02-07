import React, { Component } from "react";
import PropTypes from "prop-types";
import { cordovaDot } from "../../utils/cordovaUtils";
import ImageHandler from "../ImageHandler";
import { renderLog } from "../../utils/logging";

export default class CheckBox extends Component {
  static propTypes = {
    friendId: PropTypes.string.isRequired,
    friendName: PropTypes.string,
    friendImage: PropTypes.string,
    grid: PropTypes.string,
    handleCheckboxChange: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      isChecked: false,
    };
    this.toggleCheckboxChange = this.toggleCheckboxChange.bind(this);
  }

  toggleCheckboxChange () {
    const { friendId, friendName } = this.props;
    const { isChecked } = this.state;
    this.setState({
      isChecked: !isChecked,
    });
    this.props.handleCheckboxChange(friendId, friendName);
  }

  render () {
    renderLog(__filename);
    const { isChecked } = this.state;
    return (
      <div className={`${this.props.grid} friends-list__square u-cursor--pointer`} onClick={this.toggleCheckboxChange}>
        <ImageHandler
          sizeClassName={isChecked ? "friends-list__square-image friends-list__square-following" : "friends-list__square-image"}
          imageUrl={this.props.friendImage}
          alt={this.props.friendName}
        />
        { isChecked && (
        <ImageHandler
          className="friends-list__square-check-mark"
          imageUrl={cordovaDot("/img/global/svg-icons/check-mark-v2-40x43.svg")}
          alt="Inviting"
        />
        ) }
        <h4 className="intro-modal__white-space friends-list__square-name">{this.props.friendName}</h4>
      </div>
    );
  }
}
