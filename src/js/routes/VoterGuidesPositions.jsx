import React, {Component, PropTypes } from "react";
import Helmet from "react-helmet";

/* VISUAL DESIGN HERE: https://invis.io/8F53FDX9G */

export default class VoterGuidesPositions extends Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object
  };

  constructor (props) {
    super(props);
  }

  render () {
    return <div className="opinions-followed__container">
      <Helmet title="Positions - We Vote" />
      <section className="card">
        <div className="card-main">
          <h1 className="h1">Positions (Coming Soon)</h1>
        </div>
      </section>
    </div>;
  }
}
