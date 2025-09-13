import React from 'react';
import ComplexityBadge from './ComplexityBadge';

const ComplexityOverview = ({ timeComplexity, spaceComplexity }) => {
  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2">
      <ComplexityBadge type="time" complexity={timeComplexity} />
      <ComplexityBadge type="space" complexity={spaceComplexity} />
    </div>
  );
};

export default ComplexityOverview;
