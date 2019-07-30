import React, { Component } from 'react';
import OpenExternalWebSite from './OpenExternalWebSite';
import { cordovaDot } from '../../utils/cordovaUtils';
import positionIcon from '../../../img/global/svg-icons/positions-icon-24-x-24.svg';
import SplitIconButton from './SplitIconButton';

const text = 'Don\'t see your favorite organization or endorsement? We Vote is nonpartisan and welcomes public endorsements of candidates and measures from any organization or public figure.';

const endorsementText = (
  <span className="social-btn-description">
    <i className="fas fa-info-circle" />
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
              className="u-no-underline"
              target="_blank"
              title="ENDORSEMENTS MISSING?"
              body={(
                // <Button
                //   className="split-button split-button__left"
                //   id="myValuesAddEndorsementsToWeVote"
                //   color="primary"
                //   variant="contained"
                // >
                //   <span className="split-button__icon">
                //     <img src={cordovaDot('/img/global/svg-icons/positions-icon-24-x-24.svg')} alt="" />
                //   </span>
                //   <div className="split-button__seperator split-button__seperator--left" />
                //   <span className="split-button__text">
                //     Add endorsements
                //   </span>
                // </Button>
                <SplitIconButton
                  title="Endorsements missing?"
                  id="myValuesAddEndorsementsToWeVote"
                  icon={<img src={cordovaDot(positionIcon)} alt="" />}
                  buttonText="Add endorsements"
                />
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
