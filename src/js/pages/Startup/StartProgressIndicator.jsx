import { Done } from '@mui/icons-material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import React from 'react';
import commonMuiStyles from '../../common/components/Style/commonMuiStyles';
import { InnerWrapper, OuterWrapper, StepCircle, StepNumber } from '../../common/components/Style/stepDisplayStyles';
import { renderLog } from '../../common/utils/logging';
import CircleEnum from './CircleEnum';
import StartedState from './StartedState';


// React functional component example
function StartProgressIndicator (params) {
  const { startedStateArray } = params;
  renderLog('StartProgressIndicator functional component');
  // const displayState = StartedState.getDisplayState();

  function onCircleClick (event) {
    console.log('onCircleClick changing display state to', event);
    const newDisplayState = parseInt(event);
    StartedState.setDisplayState(newDisplayState);
    // demo only hack
    if (newDisplayState === 4) {
      StartedState.setCheckedState(true, 2);
    } else if (newDisplayState === 3) {
      StartedState.setCheckedState(false, 2);
    }
  }

  return (
    <OuterWrapper>
      <InnerWrapper>
        {startedStateArray.map((circleState, i) => {
          const circleNumberString = (i + 1).toString();
          const element = StartedState.getCircleState(i);
          const numberOfStates = startedStateArray.length;
          let core;
          let inverse = false;
          // eslint-disable-next-line default-case
          switch (element) {
            case CircleEnum.bordered:
              core = circleNumberString;
              break;
            case CircleEnum.filled:
              core = circleNumberString;
              inverse = true;
              break;
            case CircleEnum.checked:
              core = <Done classes={{ root: commonMuiStyles.doneIcon }} />;
              break;
            case CircleEnum.checkedFilled:
              core = <Done classes={{ root: commonMuiStyles.doneIcon }} />;
              inverse = true;
              break;
          }

          return (
            <div key={circleNumberString} style={{ display: 'flex' }}>
              <StepCircle
                className="u-cursor--pointer"
                inverseColor={inverse}
                onClick={() => onCircleClick(circleNumberString)}
              >
                <StepNumber inverseColor={inverse}>
                  {core}
                </StepNumber>
              </StepCircle>
              <SeparatorBar disp={i < numberOfStates - 1} />
            </div>
          );
        })}
      </InnerWrapper>
    </OuterWrapper>
  );
}

const SeparatorBar = styled('hr', {
  shouldForwardProp: (prop) => !['disp'].includes(prop),
})(({ disp }) => (`
  display: ${disp ? '' : 'none'};
  width: 40px;
  margin-top: 14px;
  border-top: 2px solid green;
  border-radius: 2px;
  margin-right: 4px;
  margin-left: 4px;
`));

export default withStyles(commonMuiStyles)(StartProgressIndicator);
