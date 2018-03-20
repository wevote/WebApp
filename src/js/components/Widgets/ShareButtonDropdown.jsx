import React, { Component } from "react";
import PropTypes from "prop-types";
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
    this.setState({ open: true });
  }

  shareFacebookComment (event) {
    event.stopPropagation();
    window.FB.ui({
      display: "popup",
      method: "share",
      // Sharing this href link to facebook(href must be a valid url else facebook share popup will be having issues)
      href: this.props.urlBeingShared,
      redirect_uri: this.props.urlBeingShared   // redirecting to the same url after sharing on facebook
    }, function (){});
    this.closeDropdown();
 }

  closeCopyLinkModal () {
    this.setState({ showCopyLinkModal: false });
  }

  openCopyLinkModal (event) {
    event.stopPropagation();
    this.setState({ showCopyLinkModal: true });
    this.closeDropdown();
  }

  onButtonBlur () {
    // Delay closing the drop down so that onClick has time to work
    var temp_this = this;
    setTimeout(function () {
      temp_this.closeDropdown();
      }, 250);
  }

  render () {
    const {shareIcon, shareText, urlBeingShared} = this.props;
    const onClick = this.state.open ? this.closeDropdown.bind(this) : this.openDropdown.bind(this);
    const onCopyLinkClick = this.state.showCopyLinkModal ? this.closeCopyLinkModal.bind(this) : this.openCopyLinkModal.bind(this);
    // const onButtonBlur = ;
    const dropdownClass = this.state.open ? " open" : "";

    return <div className="item-actionbar__btn-set">
      <div className={"btn-group" + dropdownClass}>
        <button onBlur={this.onButtonBlur.bind(this)} onClick={onClick} className="dropdown-toggle item-actionbar__btn btn btn-default">
          {shareIcon} {shareText} <span className="caret" />
        </button>
        {this.state.open ?
          <ul className="dropdown-menu">
            <li>
              <a onClick={onCopyLinkClick}>
                  Copy link
              </a>
            </li>
            <li>
              <a onClick={this.shareFacebookComment.bind(this)}>
                  Share on Facebook
              </a>
            </li>
          </ul> :
          null
        }
        </div>
      <CopyLinkModal show={this.state.showCopyLinkModal}
                     onHide={this.closeCopyLinkModal.bind(this)}
                     urlBeingShared={urlBeingShared} />
    </div>;
  }
}
