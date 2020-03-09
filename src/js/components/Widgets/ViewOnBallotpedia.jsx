import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OpenExternalWebSite from './OpenExternalWebSite';
import { cordovaDot } from '../../utils/cordovaUtils';
import ballotpediaIcon from '../../../img/global/logos/ballotpedia-initials-67x48.png';
import SplitIconButton from './SplitIconButton';


class ViewOnBallotpedia extends Component {
  static propTypes={
      externalLinkUrl: PropTypes.string,
    };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div className="card">
        <div className="card-main">
          <div className="network-btn">
            <OpenExternalWebSite
              url={this.props.externalLinkUrl}
              target="_blank"
              title="BALLOTPEDIA"
              body={(
                <SplitIconButton
                  title="Endorsements missing?"
                  icon={<img src={cordovaDot(ballotpediaIcon)} alt="" />}
                  buttonText="Ballotpedia"
                  backgroundColor="#fff"
                  fontColor="#000"
                />
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ViewOnBallotpedia;
