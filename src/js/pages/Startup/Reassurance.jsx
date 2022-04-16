import PropTypes from 'prop-types';
import React from 'react';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../common/components/Style/adviceBoxStyles';
import { renderLog } from '../../common/utils/logging';

// React functional component example
export default function Reassurance (props) {
  const { displayState, reassuranceText } = props;
  renderLog('Reassurance functional component');
  // console.log('Reassurance displayState:', displayState);
  let reassuranceTextExists = false;
  reassuranceText.forEach((block) => {
    if (block.page === displayState) {
      reassuranceTextExists = true;
    }
  });
  if (!reassuranceTextExists) return '';
  let i = 0;
  return (
    <AdviceBoxWrapper>
      <AdviceBox>
        { reassuranceText.map((block) => {
          if (block.page !== displayState) {
            // console.log('block:', block);
            return null;
          } else {
            return (
              <div key={(i++).toString()}>
                <AdviceBoxTitle>
                  {block.headline}
                </AdviceBoxTitle>
                <AdviceBoxText style={{ marginBottom: '14px' }}>
                  {block.text}
                </AdviceBoxText>
              </div>
            );
          }
        })}
      </AdviceBox>
    </AdviceBoxWrapper>
  );
}
Reassurance.propTypes = {
  displayState: PropTypes.number.isRequired,
  reassuranceText: PropTypes.array.isRequired,
};
