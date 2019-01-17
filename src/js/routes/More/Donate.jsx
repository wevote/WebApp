import React, { Component } from "react";
import {
  Button, Form, InputGroup, FormControl,
} from "react-bootstrap";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import DonationForm from "../../components/Donation/DonationForm";
import DonationError from "../../components/Donation/DonationError";
import DonateStore from "../../stores/DonateStore";
import DonationListForm from "../../components/Donation/DonationListForm";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";

export default class Donate extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showCustomInput: false,
      custom_amount: "",
      donateMonthly: true,
      donationErrorMessage: "",
      radioSelected: "monthly",
    };

    this._toggleCustomAmount = this._toggleCustomAmount.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this._updateCustomAmount = this._updateCustomAmount.bind(this);
    this._toggleDonateMonthly = this._toggleDonateMonthly.bind(this);
    this._donateStoreChange = this._donateStoreChange.bind(this);
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
    this._donateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this._donateStoreChange);
    AnalyticsActions.saveActionDonateVisit(VoterStore.election_id());
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
  }

  _donateStoreChange () {
    if (!DonateStore.donationSuccess()) {
      this.setState({ donationErrorMessage: DonateStore.donationError() });
    }
  }

  _toggleDonateMonthly (event) {
    if (event.target.value === "once") {
      this.setState({
        donateMonthly: false, radioSelected: "once",
      });
    } else {
      this.setState({
        donateMonthly: true, radioSelected: "monthly",
      });
    }
  }

  _toggleCustomAmount () {
    const { showCustomInput } = this.state;
    this.setState({
      showCustomInput: !showCustomInput,
    });
  }

  _updateCustomAmount (event) {
    this.setState({ custom_amount: event.target.value });
  }

  /*
  An enter keystroke in the react-bootstrap InputGroup, (or in the original react "input-group",)
  causes a page reload, and you lose context.  So swallow the 'Enter' keystroke event while in
  the InputGroup.
   */
  _handleKeyPress (event) { // eslint-disable-line
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  render () {
    renderLog(__filename);
    const donateMailtoUrl = "mailto:donate@WeVoteEducation.org?subject=Donate to We Vote's 501(c)(3)&body=I am interested in making at tax deductible donating to We Vote's 501(c)(3).";

    return (
      <div className="Donate">
        <Helmet title="Donate - We Vote" />
        <div className="container-fluid card">
          <div style={{ marginTop: 0, marginBottom: 0 }}>
            <h1 className="h4">Your donations keep us going. Thank you!</h1>

            {this.state.donationErrorMessage.length > 0 ?
              <DonationError errorMessage={this.state.donationErrorMessage} /> :
              <p>Please give what you can to help us reach more voters.</p>}
            <div className="d-none d-sm-block"><br /></div>
            <br />
            Gift Type:
            <Form className="d-flex flex-row">
              {/* <div key={'default-radio'} */}
              <Form.Check
                type="radio"
                label="Monthly"
                bsPrefix="radio"
                value="monthly"
                style={{ margin: 24 }}
                onChange={this._toggleDonateMonthly}
                checked={this.state.radioSelected === "monthly"}
              />
              {" "}
              <Form.Check
                type="radio"
                label="One-Time"
                name="radioGroup"
                bsPrefix="radio"
                value="once"
                style={{ margin: 24 }}
                onChange={this._toggleDonateMonthly}
                checked={this.state.radioSelected === "once"}
              />
              {" "}
            </Form>
            Select an Amount:
            <br />
            <DonationForm
              donationAmount={500}
              donateButtonText="$5"
              donateMonthly={this.state.donateMonthly}
            />
            <DonationForm
              donationAmount={1500}
              donateButtonText="$15"
              donateMonthly={this.state.donateMonthly}
            />
            <DonationForm
              donationAmount={2700}
              donateButtonText="$27"
              donateMonthly={this.state.donateMonthly}
            />
            <DonationForm
              donationAmount={5000}
              donateButtonText="$50"
              donateMonthly={this.state.donateMonthly}
            />
            <DonationForm
              donationAmount={10000}
              donateButtonText="$100"
              donateMonthly={this.state.donateMonthly}
            />

            <Button bsPrefix="btn_donate btn btn-success" variant="success" onClick={this._toggleCustomAmount}>
            Other Amount
            </Button>

            {this.state.showCustomInput ? (
              <span>
                <InputGroup className="mb-3" style={{ width: "50%" }}>
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  {/* <FormControl aria-label="Amount" /> */}
                  <FormControl
                    type="text"
                    onKeyPress={this._handleKeyPress}
                    onChange={this._updateCustomAmount}
                    value={this.state.custom_amount}
                    placeholder="250.00"
                  />

                  <InputGroup.Append>
                    <DonationForm
                      donationAmount={parseInt(parseFloat(this.state.custom_amount.replace(/[^0-9.]+/g, "")) * 100, 10)}
                      donateMonthly={this.state.donateMonthly}
                      donateButtonText="Go"
                      donateOther
                    />
                  </InputGroup.Append>
                </InputGroup>
              </span>
            ) : null
            }

            {Number.isNaN(this.state.custom_amount) || this.state.custom_amount === "0" ? (
              <span>
                <p>Please enter a valid number</p>
              </span>
            ) : null
            }
            <div className="d-none d-sm-block"><br /></div>
            <br />
            These contributions or gifts are not tax deductible. These donations are for We Vote&apos;s 501(c)(4) nonprofit.
            We Vote&apos;s 501(c)(3) nonprofit also
            {" "}
            {/* This is a mailto! */}
            <a href={donateMailtoUrl} title="Donate to We Vote's 501(c)(3)">accepts tax deductible donations.</a>
            <br />
            <br />
            <DonationListForm />
          </div>
          <div id="users-device-size">
            <div id="xs" className="d-none d-sm-block" />
          </div>
        </div>
      </div>
    );
  }
}
