import React, { Component } from "react";
import Helmet from "react-helmet";
import { renderLog } from "../../utils/logging";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import { organizationalDonors, teamOfVolunteers } from "./people";

export default class Credits extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog(__filename);
    return (
      <div>
        <Helmet title="Credits - We Vote" />
        <div className="container-fluid card">
          <h1 className="h1">Credits</h1>

          <h3 className="h4">We are grateful for these organizations that are critical to our work.</h3>
          { organizationalDonors.map(item => (
            <div className="company" key={item.name}>
              <div className="company__logo_container">
                <img className="company__logo" src={item.logo} />
              </div>
              <div className="company__info">
                <strong>{item.name}</strong>
                <p className="company__title">
                  {item.title}
                </p>
              </div>
            </div>
          )) }
          <h3 className="h4">Special thanks to our team of volunteers.</h3>
          <p>
            You are the best!
            <br />
            (This is a list of volunteers who have contributed 10 or more hours, in rough order of hours contributed.)
            <br />
          </p>
          <ul>
            { teamOfVolunteers.map(item => (
              <div key={item.name}>
                <li>
                  <strong>{item.name}</strong>
                  {" "}
                  -
                  {" "}
                  {item.title}
                </li>
              </div>
            ))
            }
          </ul>
          <br />

          <h3>Join Us!</h3>
          We couldn’t do what we do without volunteers and donors. Please sign up to volunteer at
          <OpenExternalWebSite
            url="http://WeVoteTeam.org/volunteer"
            target="_blank"
            className="open-web-site open-web-site__no-right-padding"
            body="http://WeVoteTeam.org"
          />
          .
          <br />
          <br />
        </div>
      </div>
    );
  }
}
