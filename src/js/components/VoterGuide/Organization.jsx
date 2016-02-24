import React, { Component, PropTypes } from "react";

function numberWithCommas (num) {
  var parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export default class Organization extends Component {
  static propTypes = {
    id: PropTypes.string,
    key: PropTypes.string,
    imageUrl: PropTypes.string,
    displayName: PropTypes.string,
    followers: PropTypes.number,
    children: PropTypes.array
  };

  constructor (props) {
    super(props);
  }

  render () {

    const {
      displayName,
      imageUrl,
      followers,
    } = this.props;

    const org =
      <div className="organization col-sm-12">
        <div className="thumbnail">
          <img src={imageUrl} alt={displayName + ".jpg"} />
          <div className="caption">
            <h3>{displayName}</h3>
            <p>{numberWithCommas(followers)} Twitter Followers</p>
            <p style={ {textAlign: "right"}}>
              {this.props.children}
            </p>
          </div>
        </div>
      </div>;

    return org;
  }

}
