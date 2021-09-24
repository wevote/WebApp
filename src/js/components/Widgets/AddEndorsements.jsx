import React, { Component } from 'react';
import { cordovaDot } from '../../utils/cordovaUtils';
import InfoCircleIcon from './InfoCircleIcon';
import SplitIconButton from './SplitIconButton';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../Widgets/OpenExternalWebSite'));

const positionIcon = '../../../img/global/svg-icons/positions-icon-24-x-24.svg';
const text = 'Don\'t see your favorite organization or endorsement? We Vote is nonpartisan and welcomes public endorsements of candidates and measures from any organization or public figure.';

const endorsementText = (
  <span className="social-btn-description">
    <InfoCircleIcon />
    {text}
  </span>
);

class AddEndorsements extends Component {
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
              linkIdAttribute="addEndorsements"
              url="https://api.wevoteusa.org/vg/create/"
              className="u-no-underline"
              target="_blank"
              title="ENDORSEMENTS MISSING?"
              body={(
                <SplitIconButton
                  buttonText="Add endorsements"
                  externalUniqueId="myValuesAddEndorsementsToWeVote"
                  icon={<img src={cordovaDot(positionIcon)} alt="" />}
                  id="myValuesAddEndorsementsToWeVote"
                  title="Endorsements missing?"
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
