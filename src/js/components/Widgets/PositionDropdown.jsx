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

  render () {
    const {removePositionFunction, positionIcon, positionText} = this.props;
    const onClick = this.state.open ? this.closeDropdown.bind(this) : this.openDropdown.bind(this);

    return <div className="btn-group open">
      <button onBlur={this.closeDropdown.bind(this)} onClick={onClick} className="dropdown item-actionbar__btn item-actionbar__btn--position-selected btn btn-default">
        {positionIcon} {positionText} <span className="caret"></span>
      </button>
      {this.state.open &&
        <ul className="dropdown-menu">
          <li>
            <a autoFocus onMouseDown={removePositionFunction}>
                Remove Position
            </a>
          </li>
        </ul>
      }
    </div>;
  }
}
