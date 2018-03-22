import React, { Component } from "react";
import PropTypes from "prop-types";

const footStyle = {
  backgroundColor: "#1c2f4b",
  borderTop: "1px solid #E7E7E7",
  color: "#fff",
  position: "fixed",
  left: 0,
  bottom: 0,
  height: 54,
  width: "100%",
};

const footContainer = {
  paddingLeft: 20,
  paddingRight: 20,
  paddingBottom: 12,
  paddingTop: 10,
  alignItems: "center",
  display: "flex",
  position: "relative",
  flexDirection: "row",
  justifyContent: "center",
};

export default class FooterDoneBar extends Component {
  static propTypes = {
    doneFunction: PropTypes.func.isRequired,
    doneButtonText: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }


  render () {
    return <div className= "" style={footStyle}>
      <div className="" >
        <div className="" style={footContainer} >
          <button type="button" className="btn btn-sm btn-default"
                  onClick={() => this.props.doneFunction()}>{this.props.doneButtonText}</button>
        </div>
      </div>
    </div>;
  }
}
