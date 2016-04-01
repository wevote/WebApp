import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

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
    this.state = { error: false };
  }

  brokenLink (){
    this.setState({error: true});
  }

  render () {

    const {
      displayName,
      followers,
      id,
      imageUrl,
    } = this.props;

    var voter_guide_we_vote_id_link = "/voterguide/" + id;

    const image = this.state.error ?
      <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color"/> :
      <img src={imageUrl} onError={this.brokenLink.bind(this)} alt={displayName + ".jpg"} />;

    const org =
      <div className="row">
        <div className="organization well well-skinny well-bg--light split-top-skinny clearfix">
          <Link to={voter_guide_we_vote_id_link}>
            <div className="hidden-xs col-sm-2">
              {image}
            </div>
            <div className="col-xs-6 col-sm-6 display-name">
              {displayName}
            </div>
          </Link>
          <div className="col-xs-6 col-sm-4 utils-paddingright0"
                style={ {textAlign: "right"} }>
              {this.props.children}
          </div>
          <div className="hidden-xs social-box">
              {numberWithCommas(followers)}
          </div>
        </div>
      </div>;

    return org;
  }

}
