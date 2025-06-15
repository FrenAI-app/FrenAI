
import React from 'react';

interface PortalPhaseProps {
  isActive: boolean;
}

const PortalPhase: React.FC<PortalPhaseProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Empty portal phase - no circular rings */}
      <div className="relative">
        {/* Portal phase now just provides timing without visual elements */}
      </div>
    </div>
  );
};

export default PortalPhase;
