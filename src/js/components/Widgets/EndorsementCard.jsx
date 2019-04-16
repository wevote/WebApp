import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { cordovaDot } from '../../utils/cordovaUtils';
import OpenExternalWebSite from '../../utils/OpenExternalWebSite';

class EndorsementCard extends PureComponent {
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
                  <Button className="btn endorsement-card__btn" bsPrefix={this.props.bsPrefix} variant="primary">
                    <span>
                      {/* <svg xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink" width="20" height="20">
                        <defs><path id="a" d="M0 0h24v24H0z" /></defs>
                        <g fill="none" fillRule="evenodd" transform="translate(-2 -2)">
                          <mask id="b" fill="#fff"><use xlinkHref="#a" /></mask>
                          <path stroke="#979797" d="M.5.5h23v23H.5z" />
                          <path fill="#FFF" fillRule="nonzero" d="M20 2c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6l-4 4V4c0-1.1.9-2 2-2h16zM7.667 15h3a.662.662 0 0 0 .613-.407l1.007-2.35a.659.659 0 0 0 .046-.243v-.667c0-.366-.3-.666-.666-.666H9.563l.317-1.524.01-.106a.502.502 0 0 0-.147-.354l-.353-.35-2.193 2.197A.652.652 0 0 0 7 11v3.333c0 .367.3.667.667.667zm-1.334 0v-4H5v4h1.333zm10-10h-3a.662.662 0 0 0-.613.407l-1.007 2.35a.659.659 0 0 0-.046.243v.667c0 .366.3.666.666.666h2.104l-.317 1.524-.01.106c0 .137.057.264.147.354l.353.35 2.193-2.197A.652.652 0 0 0 17 9V5.667C17 5.3 16.7 5 16.333 5zm1.334 0v4H19V5h-1.333z" mask="url(#b)" />
                        </g>
                      </svg> */}
                      <img src={cordovaDot('/img/global/svg-icons/positions-icon-24-x-24.svg')} alt="" />
                    </span>
                    {this.props.buttonText}
                  </Button>
                )}
              />
              <div className="endorsement__text">
                {this.props.text}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EndorsementCard.propTypes = {
  buttonText: PropTypes.string,
  title: PropTypes.string,
  bsPrefix: PropTypes.string,
  text: PropTypes.string,
};

export default EndorsementCard;
