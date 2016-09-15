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
  }

  closeDropdown () {
    this.setState({ open: false });
  }

  openDropdown () {
    this.setState({open: true});
  }

  shareFacebookComment (e) {
	  
	console.log(e);
    e.stopPropagation();
    window.FB.ui({
      display: "popup",
      method: "share",
      href: this.urlBeingShared,
      redirect_uri: this.urlBeingShared
    }, function (){});
    this.closeDropdown();
 }

 copyToClipboard (e) {
   console.log(e);
   e.stopPropagation();
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
          {<li>
            <a onBlur={this.closeDropdown.bind(this)}
               onClick={this.copyToClipboard.bind(this)}>
                Copy link
            </a>
          </li>}
          <li>
            <a
               onBlur={this.closeDropdown.bind(this)}
               onClick={this.shareFacebookComment.bind(this)}>
                Share on Facebook
            </a>
          </li>
        </ul> :
        null
      }
    </div>;
  }
}
