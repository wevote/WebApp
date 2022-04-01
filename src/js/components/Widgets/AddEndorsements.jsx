import styled from 'styled-components';
import React, { Component, Suspense } from 'react';
import SplitIconButton from '../../common/components/Widgets/SplitIconButton';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import InfoCircleIcon from './InfoCircleIcon';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

const positionIcon = '../../../img/global/svg-icons/positions-icon-24-x-24.svg';

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
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="addEndorsements"
                url="https://api.wevoteusa.org/vg/create/"
                className="u-no-underline"
                target="_blank"
                title="Endorsements missing?"
                body={(
                  <SplitIconButton
                    buttonText="Add endorsements"
                    externalUniqueId="myValuesAddEndorsementsToWeVote"
                    icon={<img src={normalizedImagePath(positionIcon)} alt="" />}
                    id="myValuesAddEndorsementsToWeVote"
                    title="Endorsements missing?"
                  />
                )}
              />
            </Suspense>
            <InfoText>
              <InfoCircleIcon />
              Don&apos;t see your favorite organization or endorsement? We Vote is nonpartisan and welcomes public endorsements of candidates and measures from any organization or public figure.
            </InfoText>
          </div>
        </div>
      </div>
    );
  }
}

const InfoText = styled('div')`
  margin-top: 10px;
  word-wrap: break-word;
  float: left;
  text-align: left;
`;

export default AddEndorsements;
