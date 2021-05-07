import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormatQuote } from '@material-ui/icons';
import { renderLog } from '../../utils/logging';
import ImageHandler from '../ImageHandler';


class Testimonial extends React.Component {
  shouldComponentUpdate (nextProps) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.props.testimonialAuthor !== nextProps.testimonialAuthor) {
      return true;
    }
    if (this.props.testimonial !== nextProps.testimonial) {
      return true;
    }
    if (this.props.imageUrl !== nextProps.imageUrl) {
      return true;
    }
    return false;
  }

  render () {
    renderLog('Testimonial');  // Set LOG_RENDER_EVENTS to log all renders
    const { testimonialAuthor, imageUrl, testimonial, textStyle } = this.props;
    return (
      <TestimonialContainer>
        <ImageHandler
          className="card-main__avatar__testimonial"
          imageUrl={imageUrl}
          alt="candidate-photo"
          kind_of_ballot_item="CANDIDATE"
        />
        <TestimonialAuthor>
          {testimonialAuthor}
        </TestimonialAuthor>
        <TextStyled
          style={textStyle}
        >
          <FormatQuote style={{
            transform: 'rotate(180deg)',
            verticalAlign: 'text-bottom',
            position: 'relative',
            top: '3px',
            marginLeft: '-4px',
          }}
          />
          {testimonial}
        </TextStyled>
      </TestimonialContainer>
    );
  }
}
Testimonial.propTypes = {
  testimonialAuthor: PropTypes.string,
  testimonial: PropTypes.string,
  imageUrl: PropTypes.string,
  textStyle: PropTypes.object,
};

const TestimonialContainer = styled.div`
  display: block;
  float: right;
  background-color: white;
  border-radius: 4px;
  width: 100%;
  @media print{
    display: none;
  }
`;

const TestimonialAuthor = styled.div`
  text-align: center;
  color: #999;
  font-style: italic;
  font-size: 10px;
`;

const TextStyled = styled.div`
  display: block;
  color: #2e3c5d;
  font-weight: 600;
  font-family: ${'$heading-font-stack'};
  text-align: left;
  margin: -5px 15px 15px 15px;
  border-width: medium;
  font-size: 14px;
  line-height: normal;
  :after {
    content: "";
    display: block;
    margin: 0 auto;
    width: 50%;
    padding-top: 15px;
    border-bottom: 2px solid;
  }
`;

export default Testimonial;
