import React, { Component, PropTypes } from "react";
import ImageHandler from "../ImageHandler";

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
    this.setState({
      isChecked: !this.state.isChecked,
    });
    this.props.handleCheckboxChange(friendId, friendName);
  }

  render () {
    const { isChecked } = this.state;
    return (
      <div className={this.props.grid + " friends-list__square"} onClick={this.toggleCheckboxChange}>
        <ImageHandler sizeClassName={"friends-list__square-image u-cursor--pointer" + (isChecked && " friends-list__square-following")}
                      imageUrl={this.props.friendImage}
                      alt={this.props.friendName} />
        { isChecked && <ImageHandler className="friends-list__square-check-mark u-cursor--pointer"
                      imageUrl="/img/global/svg-icons/check-mark-v2-40x43.svg"
                      alt="Inviting" /> }
        <h4 className="intro-modal__white-space friends-list__square-name">{this.props.friendName}</h4>
      </div>
    );
  }
}
