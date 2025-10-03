import React from "react";

const steps = ["Basic Info", "Profile", "Address", "Preview"];

interface Props {
  step: number;
}

const ProgressBar: React.FC<Props> = ({ step }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between">
        {steps.map((label, index) => {
          const active = step >= index + 1;

          return (
            <div
              key={index}
              className="flex items-center sm:flex-1 sm:items-center sm:justify-center mb-4 sm:mb-0"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${
                  active ? "bg-rose-600" : "bg-gray-300"
                }`}
              >
                {index + 1}
              </div>
              <span className="ml-2 text-sm sm:ml-2 sm:text-base">{label}</span>

              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block flex-1 h-1 mx-2 ${
                    active ? "bg-rose-600" : "bg-gray-300"
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
