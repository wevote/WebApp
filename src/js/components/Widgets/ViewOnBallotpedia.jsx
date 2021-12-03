import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { cordovaDot } from '../../utils/cordovaUtils';
import SplitIconButton from '../../common/components/Widgets/SplitIconButton';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

const ballotpediaIcon = '../../../img/global/logos/ballotpedia-initials-57x33.png';


class ViewOnBallotpedia extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <Wrapper>
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="ballotpedia"
            url={this.props.externalLinkUrl}
            target="_blank"
            title="BALLOTPEDIA"
            body={(
              <SplitIconButton
                adjustedIconWidth={50}
                buttonText="Ballotpedia"
                backgroundColor="#fff"
                compressedSize
                externalUniqueId="viewOnBallotpedia"
                fontColor="#000"
                icon={<img src={cordovaDot(ballotpediaIcon)} alt="" />}
                title="View on Ballotpedia"
              />
            )}
          />
        </Suspense>
      </Wrapper>
    );
  }
}
ViewOnBallotpedia.propTypes = {
  externalLinkUrl: PropTypes.string,
};

const Wrapper = styled.div`
  margin-bottom: 12px;
`;

export default ViewOnBallotpedia;
