import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import OpenExternalWebSite from './OpenExternalWebSite';
import { cordovaDot } from '../../utils/cordovaUtils';

const text = 'Don\'t see your favorite organization or endorsement? We Vote is nonpartisan and welcomes public endorsements of candidates and measures from any organization or public figure.';

const endorsementText = (
  <span className="social-btn-description">
    <i className="fa fa-info-circle" />
    {text}
  </span>
);

class AddEndorsements extends Component {
  static propTypes={};

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
              url="https://api.wevoteusa.org/vg/create/"
              className="opinions-followed__missing-org-link"
              target="_blank"
              title="Endorsements Missing?"
              body={(
                <Button
                  bsPrefix="u-margin-top--sm u-stack--xs"
                  className="btn btn-social btn-lg value-btn value-btn__endorsements text-center"
                  id="myValuesAddEndorsementsToWeVote"
                  variant="primary"
                >
                  <span>
                    <img src={cordovaDot('/img/global/svg-icons/positions-icon-24-x-24.svg')} className="value-btn__endorsements--icon" alt="" />
                  </span>
                  Add endorsements to We Vote
                </Button>
              )}
            />
            {endorsementText}
          </div>
        </div>
      </div>
    );
  }
}

export default AddEndorsements;
