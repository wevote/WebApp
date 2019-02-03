import React, { Component } from "react";
import PropTypes from "prop-types";
import CopyLinkModal from "./CopyLinkModal";
import { renderLog } from "../../utils/logging";
import { isWebApp } from "../../utils/cordovaUtils";

export default class ShareButtonDropDown extends Component {
  static propTypes = {
    shareIcon: PropTypes.object,
    shareText: PropTypes.string,
    urlBeingShared: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = { open: false };
    this.closeCopyLinkModal = this.closeCopyLinkModal.bind(this);
  }

  componentWillMount () {
    this.setState({
      showCopyLinkModal: false,
    });
  }

  shareFacebookComment (event) {
    event.stopPropagation();
    const api = isWebApp() ? window.FB : window.facebookConnectPlugin; // eslint-disable-line no-undef
    api.ui({
      display: "popup",
      method: "share",

      // Sharing this href link to facebook(href must be a valid url else facebook share popup will be having issues)
      href: this.props.urlBeingShared,
      redirect_uri: this.props.urlBeingShared, // redirecting to the same url after sharing on facebook
    }, () => {});
    this.closeDropDown();
  }

  closeCopyLinkModal () {
    this.setState({ showCopyLinkModal: false });
  }

  openCopyLinkModal (event) {
    event.stopPropagation();
    this.setState({ showCopyLinkModal: true });
    this.closeDropDown();
  }

  onButtonBlur () {
    // Delay closing the drop down so that onClick has time to work
    setTimeout(() => {
      this.closeDropDown();
    }, 250);
  }

  closeDropDown () {
    this.setState({ open: false });
  }

  openDropDown () {
    this.setState({ open: true });
  }

  render () {
    renderLog(__filename);
    const { shareIcon, shareText, urlBeingShared } = this.props;
    const onClick = this.state.open ? this.closeDropDown.bind(this) : this.openDropDown.bind(this);
    const onCopyLinkClick = this.state.showCopyLinkModal ? this.closeCopyLinkModal.bind(this) : this.openCopyLinkModal.bind(this);

    // const onButtonBlur = ;
    const dropdownClass = this.state.open ? " open" : "";

    return (
      <div className="item-actionbar__btn-set">
        <div className={`btn-group${dropdownClass}`}>
          <button
            className="dropdown-toggle item-actionbar__btn btn btn-default"
            onBlur={this.onButtonBlur.bind(this)}
            onClick={onClick}
            type="button"
          >
            {shareIcon}
            {" "}
            {shareText}
            {" "}
            <span className="caret" />
          </button>
          {this.state.open ? (
            <ul className="dropdown-menu d-block">
              <li className="dropdown-item">
                <a onClick={onCopyLinkClick}>
                  Copy link
                </a>
              </li>
              <li className="dropdown-item">
                <a onClick={this.shareFacebookComment.bind(this)}>
                  Share on Facebook
                </a>
              </li>
            </ul>
          ) : null
          }
        </div>
        <CopyLinkModal
          show={this.state.showCopyLinkModal}
          onHide={this.closeCopyLinkModal}
          urlBeingShared={urlBeingShared}
        />
      </div>
    );
  }
}
