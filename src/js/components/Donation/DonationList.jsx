import React, { Component } from "react";
import PropTypes from "prop-types";
import { Table, Card } from "react-bootstrap";
import moment from "moment";
import VoterStore from "../../stores/VoterStore";
import { renderLog } from "../../utils/logging";
import DonateStore from "../../stores/DonateStore";
import DonationCancelOrRefund from "./DonationCancelOrRefund";
import VoterActions from "../../actions/VoterActions";

const styles = {
  table: {
    // verticalAlign: "middle",
    // textAlign: "center",
  },
  td: {
    // verticalAlign: "middle",
    // textAlign: "center",
  },
  th: {
    // textAlign: "center",
  },
  Card: {
    borderTopColor: "transparent",
    height: "500px",
    overflowY: "auto",
  },
};

export default class DonationList extends Component {
  static propTypes = {
    displayDonations: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      journal: null,
    };
    this.isNotMobile = this.isNotMobile.bind(this);
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this.donateStoreListener = DonateStore.addListener(this._onDonateStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.donateStoreListener.remove();
  }

  _onDonateStoreChange () {
    VoterActions.voterRefreshDonations();
  }

  _onVoterStoreChange () {
    this.setState({ journal: VoterStore.getVoterDonationHistory() });
  }

  // October 2018: This is a workaround, since the current react-bootstrap does not handle the "d-none d-sm-block" correctly in th and td styles
  isNotMobile () {
    let bootstrapDetectedSizeXs = $("#users-device-size").find("div:visible").first().attr("id");
    return bootstrapDetectedSizeXs === undefined;
  }

  render () {
    renderLog(__filename);
    if (this.state.journal && this.state.journal.length > 0) {
      let donations = this.props.displayDonations;
      let isNotMobile = this.isNotMobile();

      if (donations) {
        return <Card style={styles.Card}>
          <Card.Body>
            <Table striped hover size="sm">{ /* Donations */ }
              <thead>
              <tr>
                <th >Date</th>
                <th >Amount</th>
              <th hidden={isNotMobile}>Payment</th>
              <th hidden={isNotMobile}>Card</th>
              <th hidden={isNotMobile}>Expires</th>
              <th hidden={isNotMobile}>Status</th>
                <th >Info</th>
              </tr>
              </thead>
              <tbody>{this.state.journal.map(function (item, key) {
                if (item.record_enum === "PAYMENT_FROM_UI" || item.record_enum === "PAYMENT_AUTO_SUBSCRIPTION") {
                  let refundDays = parseInt(item.refund_days_limit, 10);
                  let active =
                    moment.utc(item.created).local().isAfter(moment(new Date()).subtract(refundDays, "days")) &&
                    !item.stripe_status.includes("refund");
                  return <tr key={key}>
                    <td >{moment.utc(item.created).local().format("MMM D, YYYY")}</td>
                    <td >{item.amount}</td>
                    <td hidden={isNotMobile}>{item.record_enum === "PAYMENT_FROM_UI" ? "One time" :
                        "Subscription"}</td>
                    <td hidden={isNotMobile}>{item.brand}</td>
                    <td hidden={isNotMobile}>{"... " + item.last4}</td>
                    <td hidden={isNotMobile}>{item.exp_month + "/" + item.exp_year}</td>
                    <td hidden={isNotMobile}>{item.stripe_status === "succeeded" ? "Paid" :
                        item.stripe_status}</td>
                    <td hidden={isNotMobile}/>
                    <td >{active ?
                      <DonationCancelOrRefund item={item} refundDonation={donations} /> : null }
                    </td>
                  </tr>;
                } else {
                  return null;
                }
              }
              )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>;
      } else {
        return <Card style={styles.Card}>
          <Card.Body>
            <Table striped hover size="sm">{ /* Subscriptions */ }
              <thead>
                <tr>
                  <th hidden={isNotMobile}>Active</th>
                  <th >Started</th>
                  <th >Monthly</th>
                  <th hidden={isNotMobile}>Last Charged</th>
                  <th hidden={isNotMobile}>Card</th>
                  <th hidden={isNotMobile}>Ends with</th>
                  <th hidden={isNotMobile}>Expires</th>
                  <th hidden={isNotMobile}>Canceled</th>
                  <th >Info</th>
                </tr>
              </thead>
              <tbody>{this.state.journal.map(function (item, key) {
                if (item.record_enum === "SUBSCRIPTION_SETUP_AND_INITIAL") {
                  let active = item.subscription_canceled_at === "None" && item.subscription_ended_at === "None";
                  let cancel = item.subscription_canceled_at !== "None" ?
                    moment.utc(item.subscription_canceled_at).format("MMM D, YYYY") : "";
                  let lastcharged = item.last_charged === "None" ? "" :
                    moment.utc(item.last_charged).format("MMM D, YYYY");
                  let waiting = item.amount === "0.00";
                  return <tr key={key}>
                    <td hidden={isNotMobile}>{active ? "Active" : "----"}</td>
                    <td >{moment.utc(item.created).format("MMM D, YYYY")}</td>
                    <td >{!waiting ? item.amount : "waiting"}</td>
                    <td hidden={isNotMobile}>{!waiting ? lastcharged : "waiting"}</td>
                    <td hidden={isNotMobile}>{!waiting ? item.brand : "waiting"}</td>
                    <td hidden={isNotMobile}>{!waiting ? "... " + item.last4 : "waiting"}</td>
                    <td >{!waiting > 0 ?
                      item.exp_month + "/" + item.exp_year : "waiting"}</td>
                    <td hidden={isNotMobile}>{cancel}</td>
                    <td >
                      {active ? <DonationCancelOrRefund item={item} refundDonation={donations}/> :
                        cancel.length > 0 ? "canceled" : null}</td>
                  </tr>;
                } else {
                  return null;
                }
              }
              )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>;
      }
    } else {
      return null;
    }
  }
}
