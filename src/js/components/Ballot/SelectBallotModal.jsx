import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import BallotElectionList from "./BallotElectionList";
import BallotLocationChoices from "../Navigation/BallotLocationChoices";
import EditAddressInPlace from "../../components/Widgets/EditAddressInPlace";
import VoterStore from "../../stores/VoterStore";
import { calculateBallotBaseUrl } from "../../utils/textFormat";


export default class SelectBallotModal extends Component {
  // This modal will show a users ballot guides from previous and current elections.

  static propTypes = {
    ballotBaseUrl: PropTypes.string,
    ballotElectionList: PropTypes.array,
    google_civic_election_id: PropTypes.number,
    location: PropTypes.object,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      showSelectAddressModal: false,
    };
  }

  componentDidMount () {
    this.setState({
      location: this.props.location,
      pathname: this.props.pathname,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      location: nextProps.location,
      pathname: nextProps.pathname,
    });
  }

  render () {

    let ballotBaseUrl = calculateBallotBaseUrl(this.props.ballotBaseUrl, this.props.pathname);

    let ballotElectionList = this.props.ballotElectionList || [];

    let voter_address_object = VoterStore.getAddressObject();
    // console.log("Ballot render, voter_address_object: ", voter_address_object);

    return <Modal className="ballot-election-list ballot-election-list__modal ballot-election-list__modal-mobile"
                  show={this.props.show}
                  onHide={this.props.toggleFunction} >
      <Modal.Header closeButton onHide={this.props.toggleFunction}>
        <Modal.Title className="ballot-election-list__h1">Change to Another Ballot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditAddressInPlace address={voter_address_object}
                            toggleFunction={this.props.toggleFunction} />
        <br />
        <br />

        <BallotLocationChoices ballotBaseUrl={ballotBaseUrl}
                               google_civic_election_id={this.props.google_civic_election_id}
                               showElectionName
                               toggleFunction={this.props.toggleFunction} />
        <br />
        <br />

        <BallotElectionList ballotElectionList={ballotElectionList}
                            toggleFunction={this.props.toggleFunction}
                            ballotBaseUrl={ballotBaseUrl} />
      </Modal.Body>
    </Modal>;
  }
}
