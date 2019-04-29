import React, { Component } from 'react';
import Helmet from 'react-helmet';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import { renderLog } from '../utils/logging';


export default class Vote extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    renderLog(__filename);

    return (
      <span>
        <Helmet title="Vote - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="row">
          <div className="col-sm-12 col-md-8">
            <section className="card">
              <div className="card-main">
                <h1 className="h4">
                  Vote Section - Coming Soon
                </h1>
              </div>
            </section>
          </div>
          <div className="col-md-4 d-none d-md-block">
            Right Column
          </div>
        </div>
      </span>
    );
  }
}
