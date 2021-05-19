import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { cordovaDot } from '../../utils/cordovaUtils';
import SplitIconButton from './SplitIconButton';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './OpenExternalWebSite'));

const ballotpediaIcon = '../../../img/global/logos/ballotpedia-initials-57x33.png';


class ViewOnBallotpedia extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <Wrapper>
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
