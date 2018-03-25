import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";

export default class ToolBar extends Component {
  static propTypes = {
    hideGitHub: PropTypes.bool,
  };

  constructor (props) {
    super(props);
  }

  render () {
    renderLog(__filename);
    let hideGitHub = this.props.hideGitHub ? this.props.hideGitHub : false;

    return (
      <div className="btn-toolbar">
        <OpenExternalWebSite url="https://twitter.com/WeVote"
                             target="_blank"
                             className="btn btn-social-icon btn-twitter"
                             body={<span className="fa fa-twitter" />} />

        <OpenExternalWebSite url="https://www.facebook.com/WeVoteUSA"
                             target="_blank"
                             className="btn btn-social-icon btn-facebook"
                             body={<span className="fa fa-facebook" />} />

        <OpenExternalWebSite url="http://eepurl.com/cx_frP"
                             target="_blank"
                             className="btn btn--email"
                             body={<span>
                                    <span className="btn--email__icon glyphicon glyphicon-envelope" /> Join Newsletter</span>
                             } />

        {!hideGitHub ?
          <OpenExternalWebSite url="https://github.com/WeVote"
                               target="_blank"
                               className="btn btn-social-icon btn-github"
                               body={<span className="fa fa-github"/>}/> : null
        }

        <OpenExternalWebSite url="https://medium.com/@WeVote"
                             target="_blank"
                             className="btn btn-social-icon btn--medium"
                             body={<span className="fa fa-medium" />} />
      </div>
    );
  }
}
