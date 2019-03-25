import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme, withStyles } from '@material-ui/core/styles';
import FormatQuote from '@material-ui/icons/FormatQuote';
import { renderLog } from '../../utils/logging';
import ImageHandler from '../ImageHandler';


class Testimonial extends React.Component {
  static propTypes = {
    testimonialAuthor: PropTypes.string,
    testimonial: PropTypes.string,
    imageUrl: PropTypes.string,
  };

  render () {
    renderLog(__filename);
    const { testimonialAuthor, testimonial } = this.props;

    return (
      <TestimonialContainer>
        <ImageHandler
          className="card-main__avatar__testimonial"
          imageUrl={this.props.imageUrl}
          alt="candidate-photo"
          kind_of_ballot_item="CANDIDATE"
        />
        <TestimonialAuthor>
          {testimonialAuthor}
        </TestimonialAuthor>
        <TextStyled>
          <FormatQuote style={{ transform: 'rotate(180deg)' }} />
          {testimonial}
        </TextStyled>
      </TestimonialContainer>
    );
  }
}

const TestimonialContainer = styled.div`
  display: block;
  float: right;
  background-color: white;
  border-radius: 4px;
`;

const TestimonialAuthor = styled.div`
  text-align: center;
  color: #999;
  font-style: italic;
  font-size: 10px;
`;

const TextStyled = styled.div`
  display: block;
  color: #00749e;
  font-weight: 500;
  font-family: ${'$heading-font-stack'};
  text-align: center;
  margin: 10px 15px 15px 15px;
  border-width: medium;
  font-size: 11px;
  line-height: normal;
  :after {
    content: '';
    display: block;
    margin: 0 auto;
    width: 40%;
    padding-top: 15px;
    border-bottom: 2px solid;
  }
`;

export default withTheme()(withStyles()(Testimonial));
