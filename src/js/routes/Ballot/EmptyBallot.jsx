import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class EmptyBallot extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <div className="container-fluid well gutter-top--small fluff-full1">
          <h3 className="text-center">
            Sorry
          </h3>
          <span className="small">
            Our data providers don't have ballot data for your address yet.
            Please check back 1-2 weeks before your election day
          </span>
        </div>
      </div>
    );
  }
}
