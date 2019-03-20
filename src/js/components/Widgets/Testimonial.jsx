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
      <TestimonialStyled>
        <ImageHandler
          className="card-main__avatar__testimonial"
          // sizeClassName="icon-candidate-small u-push--sm"
          imageUrl={this.props.imageUrl}
          alt="candidate-photo"
          kind_of_ballot_item="CANDIDATE"
        />
        <div
          style={{
            'text-align': 'center',
            color: '#999',
            'font-style': 'italic',
            'font-size': '10px',
          }}
        >
          {testimonialAuthor}
        </div>
        <span
          style={{
            display: 'block',
            color: '#2E3C5D',
            'font-weight': 500,
            'text-align': 'center',
            margin: '15px 20px 20px 20px',
            'border-bottom': '1px solid',
            'padding-bottom': '15px',
            'border-width': 'medium',
            'font-size': '12px',
          }}
        >
          <FormatQuote />
          {testimonial}
        </span>
      </TestimonialStyled>
    );
  }
}

const TestimonialStyled = styled.div`
  display: block;
  float: right;
  width: 30%;
  background-color: white;
  margin-left: 50px;
  border-radius: 4px;
`;

export default withTheme()(withStyles()(Testimonial));
