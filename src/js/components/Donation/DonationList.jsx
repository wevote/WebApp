import React, { Component, PropTypes } from "react";
import {Table, Button, Panel} from "react-bootstrap";
import moment from "moment";
import VoterStore from "../../stores/VoterStore";

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
  },
  Panel: {
    borderTopColor: "transparent",
    height: "500",
    overflowY: "auto"
  }
};

export default class DonationPaymentList extends Component {
  static propTypes = {
    displayDonations: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      data: VoterStore.getVoterDonationHistory(),
    };
  }

  render () {
    if ( this.props.displayDonations ) {
      return <Panel style={styles.Panel}>
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
          <tbody> {this.state.data.map(function (item, key) {
            if ( item.record_enum === "PAYMENT_FROM_UI" || item.record_enum === "PAYMENT_AUTO_SUBSCRIPTION") {
              return <tr key={key}>
                <td style={styles.td}>{moment.utc(item.created).format("MMM D, YYYY")}</td>
                <td style={styles.td}>{item.amount}</td>
                <td style={styles.td}>{item.record_enum === "PAYMENT_FROM_UI" ? "One time" :
                                                                                "Subscription"}</td>
                <td style={styles.td}>{item.funding}</td>
                <td style={styles.td}>{item.brand}</td>
                <td style={styles.td}>{item.last4}</td>
                <td style={styles.td}>{item.exp_month + "/" + item.exp_year}</td>
                <td style={styles.td}>{item.stripe_status === "succeeded" ? "Paid" : item.stripe_status}</td>
                <td style={styles.td}><Button bsSize="small" disabled>Details</Button></td>
              </tr>;
            } else {
              return "";
            }
          })}
          </tbody>
        </Table>
      </Panel>;
    } else {
      return <Panel style={styles.Panel}>
        <Table striped condensed hover responsive>
          <thead>
          <tr>
            <th style={styles.th}>Active</th>
            <th style={styles.th}>Started</th>
            <th style={styles.th}>Monthly</th>
            <th style={styles.th}>Funding</th>
            <th style={styles.th}>Card</th>
            <th style={styles.th}>Ends with</th>
            <th style={styles.th}>Expires</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Ended</th>
            <th style={styles.th}>Canceled</th>
            <th style={styles.th}>Info</th>
          </tr>
          </thead>
          <tbody> {this.state.data.map(function (item, key) {
            if ( item.record_enum === "SUBSCRIPTION_SETUP_AND_INITIAL") {
              let active = item.subscription_canceled_at === null || item.subscription_ended_at !== null;
              let ended = item.subscription_ended_at !== null ? moment.utc(item.subscription_ended_at).
                format("MMM D, YYYY") : "";
              let cancel = item.subscription_canceled_at !== null ? moment.utc(item.subscription_canceled_at).
                format("MMM D, YYYY") : "";
              return <tr key={key}>
                <td style={styles.td}>{active ? "Active" : "----"}</td>
                <td style={styles.td}>{moment.utc(item.created).format("MMM D, YYYY")}</td>
                <td style={styles.td}>{item.amount}</td>
                <td style={styles.td}>{item.funding}</td>
                <td style={styles.td}>{item.brand}</td>
                <td style={styles.td}>{item.last4}</td>
                <td style={styles.td}>{item.exp_month + "/" + item.exp_year}</td>
                <td style={styles.td}>{item.stripe_status === "succeeded" ? "Paid" : item.stripe_status}</td>
                <td style={styles.td}>{ended}</td>
                <td style={styles.td}>{cancel}</td>
                <td style={styles.td}><Button bsSize="small" disabled>Details</Button></td>
              </tr>;
            } else {
              return "";
            }
          })}
          </tbody>
        </Table>
      </Panel>;
    }
  }
}
