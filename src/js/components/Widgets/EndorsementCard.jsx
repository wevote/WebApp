import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { cordovaDot } from '../../utils/cordovaUtils';
import OpenExternalWebSite from './OpenExternalWebSite';

class EndorsementCard extends PureComponent {
  static propTypes = {
    buttonText: PropTypes.string,
    title: PropTypes.string,
    bsPrefix: PropTypes.string,
    text: PropTypes.string,
  };

  render () {
    return (
      <div>
        <div className="card">
          <div className="card-main">
            <div className="endorsement-card">
              <OpenExternalWebSite
                url="https://api.wevoteusa.org/vg/create/"
                target="_blank"
                title={this.props.title}
                body={(
                  <Button className="btn endorsement-card__btn btn-social" bsPrefix={this.props.bsPrefix} variant="primary">
                    <span>
                      <img src={cordovaDot('/img/global/svg-icons/positions-icon-24-x-24.svg')} className="endorsement-card__btn--icon" alt="" />
                    </span>
                    {this.props.buttonText}
                  </Button>
                )}
              />
              <div className="endorsement-card__text">
                {this.props.text}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EndorsementCard;
