import React from 'react';
import ReactDelayRender from 'react-delay-render';

const Loading = () => <p>Loading...</p>;

export default ReactDelayRender({ delay: 300 })(Loading);
