import React, { Component } from "react";
import {Table, Button, Nav, NavItem, Panel} from "react-bootstrap";
import moment from "moment";
import VoterStore from "../stores/VoterStore";

const styles = {
  table: {
    verticalAlign: "middle",
    textAlign: "center"
  },
  td: {
    verticalAlign: "middle",
    textAlign: "center"
  },
  th: {
    textAlign: "center"
  }
};

export default class DonationListForm extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      voter_address: "",
      data: VoterStore.getVoterDonationHistory(),
    };
  }

  /*
  handleSelect (eventKey) {
    event.preventDefault();
    alert(`selected ${eventKey}`);
  }
  */

  render () {
    return <div className="donation_list_form">
        <Nav bsStyle="tabs" activeKey="1" onSelect={this.handleSelect}>
          <NavItem eventKey="1">Donations</NavItem>
          <NavItem eventKey="2" disabled>Subscriptions</NavItem>
        </Nav>
      <div className="history-list">
        <Panel>
          <Table striped condensed hover responsive>
            <thead>
              <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Funding</th>
                  <th style={styles.th}>Card</th>
                  <th style={styles.th}>Ends with</th>
                  <th style={styles.th}>Expires</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Info</th>
              </tr>
            </thead>
            <tbody> {this.state.data !== null ? this.state.data.map(function (item, key) {
              return <tr key={key}>
                  <td style={styles.td}>{moment.utc(item.created).format("MMM D, YYYY")}</td>
                  <td style={styles.td}>{item.amount}</td>
                  <td style={styles.td}>{item.one_time_donation ? "One time" : "Subscription"}</td>
                  <td style={styles.td}>{item.funding}</td>
                  <td style={styles.td}>{item.brand}</td>
                  <td style={styles.td}>{item.last4}</td>
                  <td style={styles.td}>{item.exp_month + "/" + item.exp_year}</td>
                  <td style={styles.td}>{item.stripe_status === "succeeded" ? "Paid" : item.stripe_status}</td>
                  <td style={styles.td}><Button bsSize="small" disabled>Details</Button></td>
                </tr>;
            }) : ""}
            </tbody>
          </Table>
        </Panel>
      </div>
    </div>;
  }
}

