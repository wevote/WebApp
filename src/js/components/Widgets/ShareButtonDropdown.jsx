import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isWebApp } from '../../utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import CopyLinkModal from './CopyLinkModal';

export default class ShareButtonDropDown extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      showCopyLinkModal: false,
    };
    this.closeCopyLinkModal = this.closeCopyLinkModal.bind(this);
  }

  componentWillUnmount () {
    if (this.timer) clearTimeout(this.timer);
  }

  onButtonBlur () {
    // Delay closing the drop down so that onClick has time to work
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.closeDropDown();
    }, 250);
  }

  shareFacebookComment (event) {
    event.stopPropagation();
    const api = isWebApp() ? window.FB : window.facebookConnectPlugin; // eslint-disable-line no-undef
    api.ui({
      display: 'popup',
      method: 'share',

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

  closeDropDown () {
    this.setState({ open: false });
  }

  openDropDown () {
    this.setState({ open: true });
  }

  render () {
    renderLog('ShareButtonDropDown');  // Set LOG_RENDER_EVENTS to log all renders
    const { shareIcon, shareText, urlBeingShared } = this.props;
    const onClick = this.state.open ? this.closeDropDown.bind(this) : this.openDropDown.bind(this);
    const onCopyLinkClick = this.state.showCopyLinkModal ? this.closeCopyLinkModal.bind(this) : this.openCopyLinkModal.bind(this);

    // const onButtonBlur = ;
    const dropdownClass = this.state.open ? ' open' : '';

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
            {' '}
            {shareText}
            {' '}
            <span className="caret" />
          </button>
          {this.state.open ? (
            <ul className="dropdown-menu d-block">
              <li className="dropdown-item">
                <a // eslint-disable-line
                  onClick={onCopyLinkClick}
                >
                  Copy link
                </a>
              </li>
              <li className="dropdown-item">
                <a // eslint-disable-line
                  onClick={this.shareFacebookComment.bind(this)}
                >
                  Share on Facebook
                </a>
              </li>
            </ul>
          ) : null}
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
ShareButtonDropDown.propTypes = {
  shareIcon: PropTypes.object,
  shareText: PropTypes.string,
  urlBeingShared: PropTypes.string,
};
