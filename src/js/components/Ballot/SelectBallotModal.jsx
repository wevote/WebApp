import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import BallotElectionListWithFilters from './BallotElectionListWithFilters';
import { isCordova } from '../../utils/cordovaUtils';
import EditAddressInPlace from '../Widgets/EditAddressInPlace';
import { calculateBallotBaseUrl } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';


export default class SelectBallotModal extends Component {
  // This modal will show a users ballot guides from previous and current elections.

  static propTypes = {
    ballotBaseUrl: PropTypes.string,
    ballotElectionList: PropTypes.array,
    organization_we_vote_id: PropTypes.string, // If looking at voter guide, we pass in the parent organization_we_vote_id
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      pathname: undefined,
    };
  }

  componentDidMount () {
    this.setState({
      pathname: this.props.pathname,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      pathname: nextProps.pathname,
    });
  }

  render () {
    renderLog(__filename);

    const ballotBaseUrl = calculateBallotBaseUrl(this.props.ballotBaseUrl, this.props.pathname);
    // console.log('SelectBallotModal render, ballotBaseUrl: ', ballotBaseUrl);

    const ballotElectionList = this.props.ballotElectionList || [];

    const voterAddressObject = VoterStore.getAddressObject();
    // console.log('SelectBallotModal render, voter_address_object: ', voter_address_object);
    return (
      <Modal
        bsPrefix={`ballot-election-list ballot-election-list__modal ballot-election-list__modal-mobile ${isCordova() && 'ballot-election-list__modal-cordova'}`}
        onHide={() => this.props.toggleFunction(this.state.pathname)}
        show={this.props.show}
      >
        <Modal.Header closeButton onHide={() => this.props.toggleFunction(this.state.pathname)}>
          <Modal.Title bsPrefix="ballot-election-list__h1">Address & Elections</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditAddressInPlace
            address={voterAddressObject}
            defaultIsEditingAddress
            pathname={this.state.pathname}
            toggleFunction={this.props.toggleFunction}
          />
          <BallotElectionListWithFilters
            ballotBaseUrl={ballotBaseUrl}
            ballotElectionList={ballotElectionList}
            organization_we_vote_id={this.props.organization_we_vote_id}
            showRelevantElections
            toggleFunction={this.props.toggleFunction}
          />
        </Modal.Body>
      </Modal>
    );
  }
}
