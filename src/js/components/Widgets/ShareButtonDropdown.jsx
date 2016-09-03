import React, { Component, PropTypes } from "react";

export default class ShareButtonDropdown extends Component {
  static propTypes = {
    params: PropTypes.object,
    shareIcon: PropTypes.object,
    shareText: PropTypes.string,
    urlBeingShared: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {open: false };

    this.shareFacebookComment = this.shareFacebookComment.bind(this, event, this.props.urlBeingShared);
    this.copyToClipboard = this.copyToClipboard.bind(this, event);
  }

  closeDropdown () {
    this.setState({ open: false });
  }

  openDropdown () {
    this.setState({open: true});
  }

  shareFacebookComment (event, urlBeingShared) {
    event.stopPropagation();
    window.FB.ui({
      display: "popup",
      method: "share",
      href: urlBeingShared,
      redirect_uri: urlBeingShared
    }, function (){});
    this.closeDropdown();
 }

 copyToClipboard (event) {
   event.stopPropagation();
   this.closeDropdown();
 }

  render () {
    const {shareIcon, shareText} = this.props;
    const onClick = this.state.open ? this.closeDropdown.bind(this) : this.openDropdown.bind(this);

    return <div className="btn-group open">
      <button onClick={onClick} className="dropdown item-actionbar__btn item-actionbar__btn--position-selected btn btn-default">
        {shareIcon} {shareText} <span className="caret"></span>
      </button>
      {this.state.open ?
        <ul className="dropdown-menu">
          {/*<li>
            <a onBlur={this.closeDropdown.bind(this)}
               onClick={this.copyToClipboard}>
                Copy link
            </a>
          </li>*/}
          <li>
            <a
               onBlur={this.closeDropdown.bind(this)}
               onClick={this.shareFacebookComment}>
                Share on Facebook
            </a>
          </li>
        </ul> :
        null
      }
    </div>;
  }
}
