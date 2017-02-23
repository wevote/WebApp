import React, { Component, PropTypes } from "react";

export default class PositionDropdown extends Component {
  static propTypes = {
    params: PropTypes.object,
    removePositionFunction: PropTypes.func.isRequired,
    positionIcon: PropTypes.object,
    positionText: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {open: false };
  }

  closeDropdown () {
    this.setState({ open: false });
  }

  openDropdown () {
    this.setState({open: true});
  }

  onButtonBlur () {
    // Delay closing the drop down so that onClick has time to work
    var temp_this = this;
    setTimeout(function () {
      temp_this.closeDropdown();
      }, 250);
  }

  render () {
    const {removePositionFunction, positionIcon, positionText} = this.props;
    const onClick = this.state.open ? this.closeDropdown.bind(this) : this.openDropdown.bind(this);
    const dropdownClass = this.state.open ? " open" : "";

    return <div className={"btn-group" + dropdownClass}>
      <button onBlur={this.onButtonBlur.bind(this)} onClick={onClick} className="dropdown-toggle item-actionbar__btn item-actionbar__btn--position-selected btn btn-default">
        {positionIcon} {positionText} <span className="caret" />
      </button>
      {this.state.open &&
        <ul className="dropdown-menu">
          <li>
            <a autoFocus onClick={removePositionFunction}>
                Remove Position
            </a>
          </li>
        </ul>
      }
    </div>;
  }
}
