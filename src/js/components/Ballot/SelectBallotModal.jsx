import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import BallotElectionList from "./BallotElectionList";
import { calculateBallotBaseUrl } from "../../utils/textFormat";


export default class SelectBallotModal extends Component {
  // This modal will show a users ballot guides from previous and current elections.

  static propTypes = {
    ballotBaseUrl: PropTypes.string,
    ballotElectionList: PropTypes.array,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }


  render () {
    let ballotBaseUrl = calculateBallotBaseUrl(this.props.ballotBaseUrl, this.props.pathname);

    let ballotElectionList = this.props.ballotElectionList || [];
    return <Modal className="ballot-election-list ballot-election-list__modal ballot-election-list__modal-mobile"
                  show={this.props.show}
                  onHide={this.props.toggleFunction} >
      <Modal.Header closeButton onHide={this.props.toggleFunction}>
        <Modal.Title className="ballot-election-list__h1">See Ballot from Another Election</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BallotElectionList ballotElectionList={ballotElectionList}
                            toggleFunction={this.props.toggleFunction}
                            ballotBaseUrl={ballotBaseUrl} />
      </Modal.Body>
    </Modal>;
  }
}
