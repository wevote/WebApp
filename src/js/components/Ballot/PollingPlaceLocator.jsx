import React, { Component } from "react";

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
          <div className="row intro-modal__grid intro-modal__default-text">
            <div className="container-fluid u-inset--md">
              <div>
                <div id="_vit">
                  {vit.load({
                    modal: true,
                    title: "Polling place locator",
                    subtitle: "Find out where to go on Election Day",
                    width: "640px",
                    height: "480px",
                    colors: { "header": "#229acd", "landscapeBackgroundHeader": "#228a9d" },
                    language: "en",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
