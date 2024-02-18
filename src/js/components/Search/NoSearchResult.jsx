import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import colors from '../../common/components/Style/Colors';

class NoSearchResult extends React.Component {
  render () {
    return (
      <NoSearchResultWrapper>
        {this.props.title}
        <p>
          {this.props.subtitle}
        </p>
      </NoSearchResultWrapper>
    );
  }
}

const NoSearchResultWrapper = styled.div`
  margin-top: 70px;
  color: ${colors.darkGrey};
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  line-height: normal;

p{
  margin-top: 10px;
  color: ${colors.darkGrey};
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}
`;

NoSearchResult.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default NoSearchResult;
