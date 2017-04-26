import React, { Component, PropTypes } from "react";

export default class CheckBox extends Component {
  static propTypes = {
    friendId: PropTypes.string.isRequired,
    friendName: PropTypes.string.isRequired,
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
    const { friendId } = this.props;
    const { isChecked } = this.state;
    return (
      <div className="card-main__media-object">
        <input type="checkbox"
          value={friendId}
          checked={isChecked}
          onChange={this.toggleCheckboxChange}
        />
      </div>
    );
  }
}
