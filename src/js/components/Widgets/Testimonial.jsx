import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme, withStyles } from '@material-ui/core/styles';
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
          className="card-main__avatar-compressed"
          sizeClassName="icon-candidate-small u-push--sm"
          imageUrl={this.props.imageUrl}
          alt="candidate-photo"
          kind_of_ballot_item="CANDIDATE"
        />
        {testimonialAuthor}
        <span style={{ display: 'block' }}>{testimonial}</span>
      </TestimonialStyled>
    );
  }
}

const TestimonialStyled = styled.div`
  display: flex;
  float: right;
  height: 100px;
  width: 30%;
  padding-left: 50px;
  background-color: white;
  margin-left: 50px;
  border-radius: 4px;
`;

export default withTheme()(withStyles()(Testimonial));
