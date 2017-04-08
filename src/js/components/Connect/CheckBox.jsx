import React, { Component, PropTypes } from "react";

export default class CheckBox extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
  };

  state = {
      isChecked: false,
  }

  toggleCheckboxChange = () => {
    const { value } = this.props;
    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));
    this.props.handleCheckboxChange(value);
  }

  render () {
    const { value } = this.props;
    const { isChecked } = this.state;
    return (
      <div className="card-main__media-object">
        <input type="checkbox"
          value={value}
          checked={isChecked}
          onChange={this.toggleCheckboxChange}
        />
      </div>
    );
  }
}
