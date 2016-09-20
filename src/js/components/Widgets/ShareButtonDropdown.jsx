import React, { Component, PropTypes } from "react";
import CopyLinkModal from "../../components/Widgets/CopyLinkModal";

export default class ShareButtonDropdown extends Component {
  static propTypes = {
    params: PropTypes.object,
    shareIcon: PropTypes.object,
    shareText: PropTypes.string,
    urlBeingShared: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = { open: false };
  }

  componentWillMount () {
    this.setState({
      showCopyLinkModal: false,
      transitioning: false
    });
  }

  closeDropdown () {
    this.setState({ open: false });
  }

  openDropdown () {
    this.setState({open: true});
  }

  shareFacebookComment (event) {
    console.log(event);
    event.stopPropagation();
    window.FB.ui({
      display: "popup",
      method: "share",
      href: this.urlBeingShared,
      redirect_uri: this.urlBeingShared
    }, function (){});
    this.closeDropdown();
 }


 closeCopyLinkModal () {
   this.setState({ showCopyLinkModal: false });
 }

 openCopyLinkModal (event) {
   console.log(event);
   event.stopPropagation();
   this.setState({ showCopyLinkModal: true });
   this.closeDropdown();
 }


  render () {
    const {shareIcon, shareText, urlBeingShared} = this.props;
    const onClick = this.state.open ? this.closeDropdown.bind(this) : this.openDropdown.bind(this);
    const onCopyLinkClick = this.state.showCopyLinkModal ? this.closeCopyLinkModal.bind(this) : this.openCopyLinkModal.bind(this);
    return <div className="btn-group open">
      <button onClick={onClick} className="dropdown item-actionbar__btn item-actionbar__btn--position-selected btn btn-default">
        {shareIcon} {shareText} <span className="caret"></span>
      </button>
      {this.state.open ?
        <ul className="dropdown-menu">
          <li>
            <a onBlur={this.closeDropdown.bind(this)}
               onClick={onCopyLinkClick}>
                Copy link
            </a>
          </li>
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
      <CopyLinkModal show={this.state.showCopyLinkModal}
                     onHide={this.closeCopyLinkModal.bind(this)}
                     urlBeingShared={urlBeingShared} />
    </div>;
  }
}
