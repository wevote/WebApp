import React, {Component} from "react";
import Helmet from "react-helmet";
import ReactPlayer from "react-player";

export default class Vision extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    return <div>
      <Helmet title="Vision - We Vote"/>
      <div className="container-fluid card">
        <h1 className="h1">Our Vision</h1>
        <div className="btn-toolbar">
          <a className="btn btn-social-icon btn-twitter" href="https://twitter.com/WeVote" target="_blank">
            <span className="fa fa-twitter"/>
          </a>

          <a className="btn btn-social-icon btn-facebook" href="https://www.facebook.com/WeVoteUSA" target="_blank">
            <span className="fa fa-facebook"/>
          </a>

          <a className="btn btn-email" href="http://eepurl.com/cx_frP" target="_blank">
            <span>
              <span className="btn-email__icon glyphicon glyphicon-envelope"/> Join Newsletter
            </span>
          </a>

          <a className="btn btn-social-icon btn-github" href="https://github.com/WeVote" target="_blank">
            <span className="fa fa-github"/>
          </a>

          <a className="btn btn-social-icon btn-medium" href="https://medium.com/@WeVote" target="_blank">
            <span className="fa fa-medium"/>
          </a>
        </div>

        <br />
        <ReactPlayer url="https://player.vimeo.com/video/121315141" width="400px" height="308px"/>
        <br />
      </div>
    </div>;
  }
}
