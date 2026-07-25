import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// Shared gray rounded card chrome used by every step's card. Gaps vary per step via the
// $gap / $mobileGap props.
const StepCard = styled.section`
  background: ${DesignTokenColors.neutralUI50};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap || 20}px;
  padding: 24px 28px;

  @media (max-width: 575px) {
    gap: ${({ $mobileGap }) => $mobileGap || 16}px;
    padding: 18px 16px;
  }
`;

export default StepCard;
