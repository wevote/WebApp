import React from 'react';
import styled from 'styled-components';
import { formatDateToYearMonthDay } from '../../utils/textFormat';

class PledgeToVote extends React.Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      electionDate: new Date('10/07/2020'),
    };

    this.setNewTime = this.setNewTime.bind(this);
  }

  componentDidMount () {
    setInterval(() => this.setNewTime(), 1000);
  }

  setNewTime () {
    const electionTime = new Date(this.state.electionDate).getTime();
    const currentTime = new Date().getTime();

    const distance = electionTime - currentTime;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    if (numbersToAddZeroTo.includes(days)) {
      days = `0${days}`;
    } else if (numbersToAddZeroTo.includes(hours)) {
      hours = `0${hours}`;
    } else if (numbersToAddZeroTo.includes(minutes)) {
      minutes = `0${minutes}`;
    } else if (numbersToAddZeroTo.includes(seconds)) {
      seconds = `0${seconds}`;
    }

    this.setState({ days, hours, minutes, seconds });
  }

  render () {
    const { days, hours, minutes, seconds, electionDate } = this.state;

    return (
      <Card className="card">
        <div className="card-main">
          <CardTitle>2,678</CardTitle>
          <CardSubTitle>confirmed or pledged voters</CardSubTitle>
        </div>
      </Card>
    );
  }
}

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

export default PledgeToVote;
