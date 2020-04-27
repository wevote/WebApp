import React from 'react';
import styled from 'styled-components';
import { TextField, Checkbox, FormControlLabel, withStyles, Button } from '@material-ui/core';
import { formatDateToYearMonthDay } from '../../utils/textFormat';

class PledgeToVote extends React.Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      goal: 10000,
      total: 7237,
      shareNameAndEmail: false,
      comments: [
        {
          name: 'Annie Brown',
          time: new Date(new Date().getTime() + 27 * 60000),
          comment: 'I vote because I care.',
        },
        {
          name: 'Tony Shapiro',
          time: new Date(new Date().getTime() + 30 * 60000),
          comment: "I'm a voter because this is OUR country.",
        },
        {
          name: 'Annie Brown',
          time: new Date(new Date().getTime() + 27 * 60000),
          comment: 'I vote because I care.',
        },
        {
          name: 'Ben White',
          time: new Date(new Date().getTime() + 17 * 60000),
          comment: 'I vote because the country needs to change. All this stuff is awesome. A great voter always votes. Dummy content.',
        },
        {
          name: 'Annie Brown',
          time: new Date(new Date().getTime() + 27 * 60000),
          comment: 'I vote because I care.',
        },
        {
          name: 'Ben White',
          time: new Date(new Date().getTime() + 17 * 60000),
          comment: 'I vote because the country needs to change. All this stuff is awesome. A great voter always votes. Dummy content.',
        },
        {
          name: 'Annie Brown',
          time: new Date(new Date().getTime() + 27 * 60000),
          comment: 'I vote because I care.',
        },
        {
          name: 'Tony Shapiro',
          time: new Date(new Date().getTime() + 30 * 60000),
          comment: "I'm a voter because this is OUR country.",
        },
        {
          name: 'Annie Brown',
          time: new Date(new Date().getTime() + 27 * 60000),
          comment: 'I vote because I care.',
        },
        {
          name: 'Annie Brown',
          time: new Date(new Date().getTime() + 27 * 60000),
          comment: 'I vote because I care.',
        },
      ],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    const { comments } = this.state;

    this.setState({ commentsToDisplay: [
      comments[0] ? comments[0] : null,
      comments[1] ? comments[1] : null,
    ]});

    setInterval(() => this.setCommentsToDisplay(), 3000);
  }

  setCommentsToDisplay () {
    const commentsWrapper = document.getElementById('comments-wrapper');

    let lastScroll;

    if (this.state.commentsToDisplay.length >= this.state.comments.length - 2) {
    } else {
      const newArray = [...this.state.commentsToDisplay];

      if (this.state.comments[this.state.commentsToDisplay.length]) {
        newArray.push(this.state.comments[this.state.commentsToDisplay.length]);

        // commentsWrapper.scrollTop = commentsWrapper.scrollHeight - commentsWrapper.clientHeight + 64;
      }

      if (this.state.comments[this.state.commentsToDisplay.length + 1]) {
        newArray.push(this.state.comments[this.state.commentsToDisplay.length + 1]);

        // commentsWrapper.scrollTop = commentsWrapper.scrollHeight - commentsWrapper.clientHeight + 32;
      } else {
        lastScroll = true;
      }

      this.setState({ commentsToDisplay: [...newArray]});

      let height = 0;

      commentsWrapper.childNodes.forEach((node) => {
        height += node.clientHeight;
      });

      console.log(height);

      if (lastScroll) {
        commentsWrapper.scrollTop = commentsWrapper.scrollHeight - commentsWrapper.clientHeight + 9999;
      } else {
        commentsWrapper.scrollTop = commentsWrapper.scrollHeight - commentsWrapper.clientHeight + 32;
      }

      // commentsWrapper.scrollTop = commentsWrapper.scrollHeight - commentsWrapper.clientHeight;
    }

    commentsWrapper.style.maxHeight = `${commentsWrapper.lastElementChild.clientHeight + commentsWrapper.lastElementChild.previousElementSibling.clientHeight + 16}px`;

    commentsWrapper.style.height = `${commentsWrapper.lastElementChild.clientHeight + commentsWrapper.lastElementChild.previousElementSibling.clientHeight + 16}px`;
  }

  handleChange () {
    this.setState({ shareNameAndEmail: !this.state.shareNameAndEmail });
  }

  render () {
    const { goal, total, comments, shareNameAndEmail, commentsToDisplay } = this.state;
    const { classes } = this.props;

    return (
      <Card className="card">
        <div className="card-main">
          <CardTitle>2,678</CardTitle>
          <CardSubTitle>confirmed or pledged voters</CardSubTitle>
          <ProgressBar percentage={total / goal * 100}>
            <span />
          </ProgressBar>
          {commentsToDisplay && commentsToDisplay.length > 0 ? (
            <CommentsWrapper id="comments-wrapper">
              {commentsToDisplay.map(comment => (
                <CommentWrapper className="comment">
                  <Comment>{comment.comment}</Comment>
                  <CommentName>
                    {comment.name}
                    {' '}
pledged
                    {' '}
                    {formatDateToYearMonthDay(comment.time)}
                  </CommentName>
                </CommentWrapper>
              ))}
            </CommentsWrapper>
          ) : (
            null
          )}
          <Input variant="outlined" placeholder="I am a voter because..." />
          <CheckboxLabel
            classes={{ label: classes.label }}
            control={(
              <Checkbox
                classes={{ root: classes.checkbox }}
                shareNameAndEmail={shareNameAndEmail}
                onChange={this.handleChange}
                name="shareNameAndEmailB"
                color="primary"
              />
            )}
            label="Please share my name and email with New King Dems"
          />
          <Button variant="contained" color="primary" fullWidth>Pledge To Vote Now</Button>
        </div>
      </Card>
    );
  }
}

const styles = () => ({
  label: {
    fontSize: 12,
    marginTop: 2,
  },
  checkbox: {
    marginTop: '-9px !important',
  },
});

const Card = styled.div`
`;

const CardTitle = styled.h2`
  display: inline-block;
  font-size: 26px;
  color: black !important;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 0px;
`;

const CardSubTitle = styled.h3`
  display: inline-block;
  font-size: 16px;
`;

const ProgressBar = styled.div`
  background: #f7f7f7;
  width: 100%;
  height: 12px;
  border-radius: 50px;
  margin: 0px 0 12px;
  span {
    width: ${props => props.percentage}%;
    display: block;
    height: 12px;
    border-radius: 50px;
    background: linear-gradient(
      to right,
      #415a99,
      #2e3c5d
    )
  }
`;

const CommentsWrapper = styled.div`
  max-height: 140px;
  overflow-y: scroll;
  transition-duration: .3s;
`;

const CommentWrapper = styled.div`
  width: 100%;
  margin: 8px 0;
  border-radius: 10px;
  border-top-left-radius: 0;
  background: #2e3c5d30;
  padding: 6px;
`;

const Comment = styled.p`
  margin: 0;
  font-weight: 900 !important;
  color: #2e3c5d;
`;

const CommentName = styled.div`
  font-size: 12px;
  color: #999;
`;

const Input = styled(TextField)`
  width: 100%;
  margin: 10px 0 12px !important;
  display: block
`;

const CheckboxLabel = styled(FormControlLabel)`
  margin-bottom: 16px !important;
`;

export default withStyles(styles)(PledgeToVote);
