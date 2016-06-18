import React from "react";

export default class Privacy extends React.Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    return <div>
        <div className="bs-container-fluid bs-well">
          <h2 className="bs-text-center">Terms and Policies</h2>
          Coming soon.
        </div>
      </div>;
  }
}
