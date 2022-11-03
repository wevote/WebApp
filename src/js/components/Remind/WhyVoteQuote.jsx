import { FormatQuote } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';

// React functional component example
export default function WhyVoteQuote (props) {
  renderLog('WhyVoteQuote functional component');
  const { testimonialAuthor, imageUrl, testimonial, textStyle } = props;
  const normalizedImageUrl = normalizedImagePath(imageUrl);
  return (
    <WhyVoteQuoteOuterWrapper>
      <PhotoColumn>
        <PhotoImg
          src={normalizedImageUrl}
          alt=""
        />
      </PhotoColumn>
      <QuoteColumn>
        <TextStyled
          style={textStyle}
        >
          <FormatQuote style={{
            transform: 'scaleX(-1)',
            verticalAlign: 'text-bottom',
            position: 'relative',
            top: 0,
            marginLeft: '-4px',
          }}
          />
          {testimonial}
          <span className="u-no-break">
            &nbsp;
            <FormatQuote style={{
              verticalAlign: 'text-bottom',
              position: 'relative',
              top: 0,
              marginLeft: '-4px',
            }}
            />
          </span>
        </TextStyled>
        <TestimonialAuthor>
          &ndash;
          {' '}
          {testimonialAuthor}
        </TestimonialAuthor>
      </QuoteColumn>
    </WhyVoteQuoteOuterWrapper>
  );
}
WhyVoteQuote.propTypes = {
  testimonialAuthor: PropTypes.string,
  testimonial: PropTypes.string,
  imageUrl: PropTypes.string,
  textStyle: PropTypes.object,
};

const PhotoColumn = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  min-width: 100px;
  width: 100px;
`;

const PhotoImg = styled('img')`
  border-radius: 50px;
  width: 100px;
  height: 100px;
`;

const TestimonialAuthor = styled('div')`
  text-align: center;
  color: #808080;
  font-style: italic;
`;

const TextStyled = styled('div')`
  color: #2e3c5d;
  font-weight: 600;
  text-align: left;
  line-height: normal;
`;

const QuoteColumn = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  padding-left: 20px;
  width: 100%;
`;

const WhyVoteQuoteOuterWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
  margin-top: 36px;
  width: 100%;
`;
