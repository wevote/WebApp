import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import OpenExternalWebSite from '../../utils/OpenExternalWebSite';

class EndorsementCard extends Component {
  render () {
    return (
      <div>
        <div className="card">
          <div className="card-main">
            <div className="endorsement">
              <OpenExternalWebSite
                url="https://api.wevoteusa.org/vg/create/"
                className="opinions-followed__missing-org-link"
                target="_blank"
                title={this.props.title}
                body={<Button className="btn endorsement__btn btn-sm" bsPrefix={this.props.bsPrefix} variant="primary">{this.props.buttonText}</Button>}
              />
              <div className="endorsement__text">
                {this.props.text}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EndorsementCard;
