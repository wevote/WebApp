import React, { Component, PropTypes } from "react";
import { DropdownButton } from "react-bootstrap";

export default class ShareButtonDropdown extends Component {
  static propTypes = {
    params: PropTypes.object,
    removePosition: PropTypes.func.isRequired,
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

  shareFacebookComment (url, title, descr, image, winWidth, winHeight) {
    var winTop = screen.height / 2 - winHeight / 2;
   var winLeft = screen.width / 2 - winWidth / 2;
   window.open("http://www.facebook.com/sharer.php?s=100&p[title]=" + title + "&p[summary]=" + descr + "&p[url]=" + url + "sharer", "top=" + winTop + ",left=" + winLeft + ",toolbar=0,status=0,width=" + winWidth + ",height=" + winHeight);
 }

  render () {
    const {removePosition, positionIcon, positionText} = this.props;
    const onClick = this.state.open ? this.closeDropdown.bind(this) : this.openDropdown.bind(this);

    return <div className="btn-group open">
      <button onClick={onClick} className="dropdown item-actionbar__btn item-actionbar__btn--position-selected btn btn-default">
        {positionIcon} {positionText} <span className="caret"></span>
      </button>
      {this.state.open &&
        <ul className="dropdown-menu">
          <li>
            <a autoFocus onClick={this.shareFacebookComment("http://myspace.com", "Myspace rules", "yep", 520, 350)} onBlur={this.closeDropdown.bind(this)}>
                Share on Facebook
            </a>
          </li>
          <li>
            <a autoFocus onClick={removePosition} onBlur={this.closeDropdown.bind(this)}>
                Copy link
            </a>
          </li>
        </ul>
      }
    </div>;
  }
}
