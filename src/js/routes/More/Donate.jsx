import React, {Component} from "react";
import { Button, FormGroup, Radio, InputGroup, FormControl } from "react-bootstrap";
import Helmet from "react-helmet";
import DonationForm from "../../components/Donation/DonationForm";
import DonationError from "../../components/Donation/DonationError";
import DonateStore from "../../stores/DonateStore";
import DonationListForm from "../../components/Donation/DonationListForm";

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
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
  }

  _donateStoreChange () {
    if (!DonateStore.donation_success()) {
      this.setState({ donationErrorMessage: DonateStore.donation_error() });
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
    this.setState({
      showCustomInput: !this.state.showCustomInput,
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
  _handleKeyPress (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  render () {
    return <div>
      <Helmet title="Donate - We Vote"/>
      <div className="container-fluid card">
        <h1 className="h4">Your donations keep us going. Thank you!</h1>

        <div className="Donate">
          {this.state.donationErrorMessage.length > 0 ?
            <DonationError errorMessage={this.state.donationErrorMessage} /> :
            <p>Please give what you can to help us reach more voters.</p>}
          <div className="hidden-xs"><br /></div>
          <br />
          Gift Type:
          <FormGroup>
            <Radio name="radioGroup" bsClass="radio" value="monthly"
                   onChange={this._toggleDonateMonthly} inline
                   checked={this.state.radioSelected === "monthly"}>
              Monthly
            </Radio>
            {" "}
            <Radio name="radioGroup" bsClass="radio" value="once"
                   onChange={this._toggleDonateMonthly} inline
                   checked={this.state.radioSelected === "once"}>
              One-Time
            </Radio>
            {" "}
          </FormGroup>
          Select an Amount:
          <br/>
          <DonationForm donationAmount={500} donateButtonText="$5"
                        donateMonthly={this.state.donateMonthly} />
          <DonationForm donationAmount={1500} donateButtonText="$15"
                        donateMonthly={this.state.donateMonthly} />
          <DonationForm donationAmount={2700} donateButtonText="$27"
                        donateMonthly={this.state.donateMonthly} />
          <DonationForm donationAmount={5000} donateButtonText="$50"
                        donateMonthly={this.state.donateMonthly} />
          <DonationForm donationAmount={10000} donateButtonText="$100"
                        donateMonthly={this.state.donateMonthly} />

          <Button className="btn_donate" bsStyle="success" onClick={this._toggleCustomAmount}>
            Other Amount
          </Button>
          <div className="hidden-xs">
            <br />
            <br />
          </div>

          {this.state.showCustomInput ?
            <span>
              <form className="form-inline">
                <FormGroup>
                  <InputGroup>
                    <InputGroup.Addon>$</InputGroup.Addon>
                    <FormControl type="text"
                                 onKeyPress={this._handleKeyPress}
                                 onChange={this._updateCustomAmount}
                                 value={this.state.custom_amount}
                                 placeholder="250.00" />
                    <InputGroup.Button>
                      <DonationForm donationAmount={parseInt(parseFloat(
                          this.state.custom_amount.replace(/[^0-9.]+/g, "")) * 100)}
                                    donateMonthly={this.state.donateMonthly}
                                    donateButtonText="Go" donateOther />
                    </InputGroup.Button>
                  </InputGroup>
                </FormGroup>
              </form>
            </span> : null }

          {isNaN(this.state.custom_amount) || this.state.custom_amount === "0" ?
            <span>
              <p>Please enter a valid number</p>
            </span> : null}
          <div className="hidden-xs"><br /></div>
          <br />
          Contributions or gifts are not tax deductible. We Vote is a 501(c)(4) nonprofit.<br />
          <br />
          <DonationListForm />
        </div>
      </div>
    </div>;
  }
}
