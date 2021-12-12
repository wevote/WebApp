import PropTypes from 'prop-types';
import React from 'react';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../common/components/Style/adviceBoxStyles';
import { renderLog } from '../../common/utils/logging';
import { reassuranceText } from './reassuranceText';

// React functional component example
export default function Reassurance (props) {
  const { displayState } = props;
  renderLog('Reassurance functional component');
  if (displayState > 3) return '';
  let i = 0;
  return (
    <AdviceBoxWrapper>
      <AdviceBox>
        { reassuranceText.map((block) => {
          if (block.page !== displayState) {
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
};
