import React from 'react';
import { cordovaDot } from '../../utils/cordovaUtils';

const icon = '../../../img/global/svg-icons/external_link_font_awesome.svg';

export default function ExternalLinkIcon () {
  return (
    <img src={cordovaDot(icon)}
         width={14}
         height={14}
         color="darkgrey"
         alt="External Link"
         style={{ weight: 500, marginBottom: '3px' }}
    />
  );
}
