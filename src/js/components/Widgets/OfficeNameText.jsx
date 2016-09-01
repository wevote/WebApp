import React, { Component, PropTypes } from "react";

export default class OfficeNameText extends Component {
  static propTypes = {
    political_party: PropTypes.string,
    office_name: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      transitioning: false
    };
  }

  componentWillReceiveProps () {
    this.setState({transitioning: false});
  }


  render () {
    let nameText = "";
    let { office_name, political_party } = this.props;
    if (political_party === undefined) {
      nameText = <span className="no-political-party">
      Candidate for <span className="candidate-card__office">
      { office_name } </span> </span>;
    } else {
      nameText = <span> <span className="candidate-card__political-party">
      {political_party} </span> candidate for <span className="candidate-card__office">
        { office_name }
      </span></span>;
    }
    return nameText;

  }
}
