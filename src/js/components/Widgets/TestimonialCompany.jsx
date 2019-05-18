import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FormatQuote from '@material-ui/icons/FormatQuote';
import { renderLog } from '../../utils/logging';
import ImageHandler from '../ImageHandler';


class TestimonialCompany extends React.Component {
  static propTypes = {
    testimonialAuthor: PropTypes.string,
    testimonial: PropTypes.string,
    imageUrl: PropTypes.string,
    testimonialCompanyLogo: PropTypes.string,
  };

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
    if (this.props.testimonialCompanyLogo !== nextProps.testimonialCompanyLogo) {
      return true;
    }
    return false;
  }

  render () {
    renderLog(__filename);
    const { testimonialAuthor: author, imageUrl: image, testimonial, testimonialCompanyLogo: logo } = this.props;

    console.log(logo);

    return (
      <TestimonialContainer>
        <ImageLogoContainer>
          <AuthorImage>
            <ImageHandler
              imageUrl={image}
              alt="candidate-photo"
              kind_of_ballot_item="CANDIDATE"
            />
          </AuthorImage>
          <CompanyImage>
            <ImageHandler
              imageUrl={logo}
              alt="candidate-photo"
              kind_of_ballot_item="CANDIDATE"
            />
          </CompanyImage>
        </ImageLogoContainer>
        <TextStyled>
          <FormatQuote style={{
            transform: 'rotateY(180deg) scale(1.4)',
            verticalAlign: 'text-bottom',
            position: 'relative',
            marginLeft: '-4px',
          }}
          />
          {testimonial}
        </TextStyled>
        <TestimonialAuthor>
          {author}
        </TestimonialAuthor>
      </TestimonialContainer>
    );
  }
}

const TestimonialContainer = styled.div`
  display: block;
  float: right;
  background-color: #f7f7f7;
  border-radius: 4px;
  width: 100%;
  padding: 32px 24px 8px;
  z-index: 999;
  position: relative;
`;

const ImageLogoContainer = styled.div`
  background: white;
  border-radius: 50px;
  position: absolute;
  height: 45px;
  width: 175px;
  display: flex;
  align-items: center;
  box-shadow: 1px 2px 5px 0px #e1e1e1;
  left: 24px;
  top: -22.5px;
`;

const AuthorImage = styled.div`
  width: 45px;
  height: 45px;
  min-width: 45px;
  min-height: 45px;
  * {
    width: 45px;
    height: 45px;
    min-width: 45px;
    min-height: 45px;
    border-radius: 50%;
  }
`;

const CompanyImage = styled.div`
  margin: 0 auto;
  padding: 0 12px;
  max-height: 100%;
  * {
    width: auto;
    height: 18px;
    max-height: 18px;
  }
`;

const TestimonialAuthor = styled.div`
  text-align: right;
  color: #999;
  font-style: italic;
  font-size: 12px;
`;

const TextStyled = styled.div`
  display: block;
  color: #2e3c5d;
  font-weight: 600;
  font-family: ${'$heading-font-stack'};
  text-align: left;
  margin: 0 0 5px;
  border-width: medium;
  font-size: 16px;
  line-height: 1.5;
`;

export default TestimonialCompany;
