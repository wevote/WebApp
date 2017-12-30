import React, { Component } from "react";

const iframeStyle = {
  border: "none",
  height: "500px",
  width: "100%"
};

export default class PollingPlaceLocator extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
  }

  render () {
    return <div className="intro-modal">
      <div className="intro-modal__h1">
        Are you looking for your Polling Location?
      </div>

      <div className="intro-modal-vertical-scroll-contain_without_slider">
        <div className="intro-modal-vertical-scroll card">
          <div className="row intro-modal__grid intro-modal__default-text u_margin-center">
            <div className="container-fluid u-inset--md">
              <div>
                  <iframe style={iframeStyle} src="https://tool.votinginfoproject.org/iframe-embed.html" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
