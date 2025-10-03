import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Step1Basic from '@/components/MultiStepForm.tsx/Step1Basic';
import Step2Profile from '@/components/MultiStepForm.tsx/Step2Profile';
import Step3Address from '@/components/MultiStepForm.tsx/Step3Address';
import Step4Preview from '@/components/MultiStepForm.tsx/Step4Preview';
import ProgressBar from '@/components/MultiStepForm.tsx/ProgressBar';

const MultiStepFormPage: React.FC = () => {
  const step = useSelector((state: RootState) => state.form.step);

  return (
    <div className="max-w-3xl mx-auto p-14 bg-white shadow-lg rounded-xl md:my-6">
      <ProgressBar step={step} />

      {step === 1 && <Step1Basic />}
      {step === 2 && <Step2Profile />}
      {step === 3 && <Step3Address />}
      {step === 4 && <Step4Preview />}
    </div>
  );
};

export default MultiStepFormPage;
