import React, {Component} from "react";
import { Button } from "react-bootstrap";
import Helmet from "react-helmet";
import DonationForm from "../../components/DonationForm";


export default class Donate extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showCustomInput: false,
      custom_amount: "",
      donateMonthly: false
    };

    this._toggleCustomAmount = this._toggleCustomAmount.bind(this);
    this._updateCustomAmount = this._updateCustomAmount.bind(this);
    this._toggleDonateMonthly = this._toggleDonateMonthly.bind(this);
  }

  static getProps () {
    return {};
  }

  ComponentDidMount () {
  }

  _toggleDonateMonthly () {
    this.setState({
      donateMonthly: !this.state.donateMonthly
    });
  }

  _toggleCustomAmount () {
      this.setState({
        showCustomInput: !this.state.showCustomInput
      });
  }

  _updateCustomAmount (event) {
    this.setState({custom_amount: event.target.value});
  }

  render () {

    return <div>
      <Helmet title="Donate - We Vote"/>
      <div className="container-fluid card">
        <h1 className="h4">Your donations keep us going. Thank you!</h1>

        <div className="Donate">
          If you like We Vote, please give what you can to help us reach more voters.<br />
          <br />
          Select an Amount<br />
          <DonationForm donationAmount={500} donateButtonText="$5" donateMonthly={this.state.donateMonthly} /> &nbsp;
          <DonationForm donationAmount={1500} donateButtonText="$15" donateMonthly={this.state.donateMonthly} /> &nbsp;
          <DonationForm donationAmount={2700} donateButtonText="$27" donateMonthly={this.state.donateMonthly} /> &nbsp;
          <DonationForm donationAmount={5000} donateButtonText="$50" donateMonthly={this.state.donateMonthly} /> &nbsp;
          <DonationForm donationAmount={10000} donateButtonText="$100" donateMonthly={this.state.donateMonthly} /> &nbsp;
          <Button bsStyle="success" onClick={this._toggleCustomAmount}>
            Other Amount
          </Button><br />&nbsp;
          {/*{this.state.showCustomInput ? null : <span><form className="form-check-inline">
            <input className="form-check-input" type="checkbox" checked={this.state.donateMonthly} onChange={this._toggleDonateMonthly}/>Donate Monthly
          </form></span>}*/}
          <span>
            <form className="form-check-inline">
              <input className="form-check-input" type="checkbox" checked={this.state.donateMonthly}
              onChange={this._toggleDonateMonthly}/>Donate Monthly
            </form>
          </span>
          <br />
           {this.state.showCustomInput ? <span>
             <form className="form-inline">
              <div className="input-group">
               <span className="input-group-addon">$</span>
                <input className="form-control form-control mb-2 mr-sm-2 mb-sm-0" value={this.state.custom_amount}
                type="text" placeholder="250.00" onChange={this._updateCustomAmount} />
              </div>&nbsp;
                <DonationForm donationAmount={parseFloat(this.state.custom_amount.replace(/[^0-9\.]+/g, "")) * 100}
                donateMonthly={this.state.donateMonthly} donateButtonText="Go" />
             </form></span> : null}

            {isNaN(this.state.custom_amount) || this.state.custom_amount == "0" ?
            <span><p>Please enter a valid number</p></span> : null}
          <br />
          <br />
          Contributions or gifts are not tax deductible. We Vote is a 501(c)(4) nonprofit.
        </div>
      </div>
    </div>;
  }
}
