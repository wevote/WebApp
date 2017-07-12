import React, { Component, PropTypes } from "react";
import {Table, Panel} from "react-bootstrap";
import moment from "moment";
import VoterStore from "../../stores/VoterStore";
import DonateStore from "../../stores/DonateStore";
import VoterActions from "../../actions/VoterActions";
import DonationCancelOrRefund from "./DonationCancelOrRefund";

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
    height: "500px",
    overflowY: "auto"
  }
};

export default class DonationList extends Component {
  static propTypes = {
    displayDonations: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {};
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

  render () {
    console.log("DonationList render");
    if (this.state.journal && this.state.journal.length > 0) {
      let donations = this.props.displayDonations;

      if (donations) {
        return <Panel style={styles.Panel}>
          <Table striped condensed hover responsive>{ /* Donations */ }
            <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Amount</th>
              <th className={"hidden-xs"} style={styles.th}>Payment</th>
              <th className={"hidden-xs"} style={styles.th}>Card</th>
              <th className={"hidden-xs"} style={styles.th}>Expires</th>
              <th className={"hidden-xs"} style={styles.th}>Status</th>
              <th style={styles.th}>Info</th>
            </tr>
            </thead>
            <tbody>{this.state.journal.map(function (item, key) {
              if (item.record_enum === "PAYMENT_FROM_UI" || item.record_enum === "PAYMENT_AUTO_SUBSCRIPTION") {
                let refundDays = parseInt(item.refund_days_limit);
                let active =
                  moment.utc(item.created).local().isAfter(moment(new Date()).subtract(refundDays, "days")) &&
                  ! item.stripe_status.includes("refund");
                return <tr key={key}>
                  <td style={styles.td}>{moment.utc(item.created).local().format("MMM D, YYYY")}</td>
                  <td style={styles.td}>{item.amount}</td>
                  <td className={"hidden-xs"} style={styles.td}>{item.record_enum === "PAYMENT_FROM_UI" ? "One time" :
                      "Subscription"}</td>
                  <td className={"hidden-xs"} style={styles.td}>{item.brand}</td>
                  <td className={"hidden-xs"} style={styles.td}>{"... " + item.last4}</td>
                  <td className={"hidden-xs"} style={styles.td}>{item.exp_month + "/" + item.exp_year}</td>
                  <td className={"hidden-xs"} style={styles.td}>{item.stripe_status === "succeeded" ? "Paid" :
                      item.stripe_status}</td>
                  <td className={"hidden-xs"} style={styles.td} />
                  <td style={styles.td}>{active ?
                    <DonationCancelOrRefund item={item} refundDonation={donations} /> : null }
                  </td>
                </tr>;
              } else {
                return null;
              }
            })}
            </tbody>
          </Table>
        </Panel>;
      } else {
        return <Panel style={styles.Panel}>
          <Table striped condensed hover responsive>{ /* Subscriptions */ }
            <thead>
            <tr>
              <th className={"hidden-xs"} style={styles.th}>Active</th>
              <th style={styles.th}>Started</th>
              <th style={styles.th}>Monthly</th>
              <th className={"hidden-xs"} style={styles.th}>Last Charged</th>
              <th className={"hidden-xs"} style={styles.th}>Card</th>
              <th className={"hidden-xs"} style={styles.th}>Ends with</th>
              <th className={"hidden-xs"} style={styles.th}>Expires</th>
              <th className={"hidden-xs"} style={styles.th}>Canceled</th>
              <th style={styles.th}>Info</th>
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
                  <td className={"hidden-xs"} style={styles.td}>{active ? "Active" : "----"}</td>
                  <td style={styles.td}>{moment.utc(item.created).format("MMM D, YYYY")}</td>
                  <td style={styles.td}>{!waiting ? item.amount : "waiting"}</td>
                  <td className={"hidden-xs"} style={styles.td}>{!waiting ? lastcharged : "waiting"}</td>
                  <td className={"hidden-xs"} style={styles.td}>{!waiting ? item.brand : "waiting"}</td>
                  <td className={"hidden-xs"} style={styles.td}>{!waiting ? "... " + item.last4 : "waiting"}</td>
                  <td className={"hidden-xs"} style={styles.td}>{!waiting > 0 ?
                    item.exp_month + "/" + item.exp_year : "waiting"}</td>
                  <td className={"hidden-xs"} style={styles.td}>{cancel}</td>
                  <td style={styles.td}>
                    {active ? <DonationCancelOrRefund item={item} refundDonation={donations}/> :
                      cancel.length > 0 ? "canceled" : null}</td>
                </tr>;
              } else {
                return null;
              }
            })}
            </tbody>
          </Table>
        </Panel>;
      }
    } else {
      return null;
    }
  }
}
