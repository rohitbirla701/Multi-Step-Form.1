import React from 'react';

const steps = ['Basic Info', 'Profile', 'Address', 'Preview'];

interface Props {
  step: number;
}

const ProgressBar: React.FC<Props> = ({ step }) => {
  return (
    <div className="mb-6 px-2 sm:px-0">
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center">
        {steps.map((label, index) => {
          const active = step >= index + 1;

          return (
            <div key={index} className="flex items-center flex-1 min-w-[60px] mb-4 sm:mb-0">
              {/* Step Circle */}
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white shrink-0 ${
                  active ? 'bg-rose-600' : 'bg-gray-300'
                }`}
              >
                {index + 1}
              </div>

              {/* Step Label */}
              <span className="ml-2 text-xs sm:text-sm md:text-base truncate">{label}</span>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 hidden sm:block ${
                    active ? 'bg-rose-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
