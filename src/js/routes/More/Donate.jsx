import React, {Component} from "react";
import Helmet from "react-helmet";
import {Link} from "react-router";
import DonationForm from "../../components/DonationForm";


export default class Donate extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    return <div>
      <Helmet title="About Us - We Vote"/>
      <div className="container-fluid card">
        <h1 className="h1">Donate to We Vote</h1>

        <br />
        <div className="Donate">
          {/*<strong>Coming Soon</strong><br />
          We will be adding a way to donate to We Vote here soon. Thank you!
          <br />*/}
          <DonationForm />

          <h3 className="h3">A Nonprofit Startup</h3>
          We Vote is made of two 501(c)(3) and 501(c)(4) nonpartisan nonprofit organizations based in
          Oakland, California. This site is managed by the 501(c)(4), We Vote USA. Our
          software is open source, and our work is driven by the nearly 100 volunteers who have contributed so far.
          Inspired by groups like <a href="http://codeforsanfrancisco.org/" target="_blank">Code for America&nbsp;<i
          className="fa fa-external-link"/>
        </a> and the <a href="https://www.mozilla.org/en-US/foundation/" target="_blank">Mozilla Foundation&nbsp;<i
          className="fa fa-external-link"/></a>, we use technology to
          make democracy stronger by increasing voter turnout.<br />

          <h3 className="h3">Credits &amp; Gratitude</h3>
          <Link to="/more/credits/">We are thankful for our volunteers, our board of directors, and the
            organizations</Link> that are critical to our work.<br />

          <h3 className="h3">Help Make We Vote Better</h3>
          <a href="https://goo.gl/forms/B6P0iE44R21t36L42" target="_blank">We would love to hear how you think we can improve We Vote.&nbsp;<i
            className="fa fa-external-link"/></a><br />
          <br />
        </div>
      </div>
    </div>;
  }
}
