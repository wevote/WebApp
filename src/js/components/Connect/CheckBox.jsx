import React, { Component, PropTypes } from "react";
import ImageHandler from "../ImageHandler";

export default class CheckBox extends Component {
  static propTypes = {
    friendId: PropTypes.string.isRequired,
    friendName: PropTypes.string,
    friendImage: PropTypes.string,
    handleCheckboxChange: PropTypes.func.isRequired,
  };

  state = {
      isChecked: false,
  }

  toggleCheckboxChange = () => {
    const { friendId, friendName } = this.props;
    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));
    this.props.handleCheckboxChange(friendId, friendName);
  }

  render () {
    const { friendId, friendName, friendImage } = this.props;
    const { isChecked } = this.state;
    return <div onClick={this.toggleCheckboxChange}>
        <input type="checkbox"
          value={friendId}
          checked={isChecked}
        />
        &nbsp;
        <ImageHandler imageUrl={friendImage} className="" sizeClassName="icon-lg" />
        &nbsp;
        {friendName}
      </div>;
  }
}
