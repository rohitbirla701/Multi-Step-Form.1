import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setFormData, nextStep } from '@/store';
import { addressData } from '@/utils/addressData';

interface Step1Form {
  fullName: string;
  username: string;
  email: string;
  country: string;
  mobile: string;
  gender: string;
  countryCode: string;
}

const Step1Basic: React.FC = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form.data);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step1Form>({
    defaultValues: formData,
  });

  const selectedCountry = watch('country') || formData.country || 'India';
  const [dialCode, setDialCode] = useState(formData.countryCode || '+91');

  useEffect(() => {
    if (selectedCountry) {
      const countryDialCode = addressData.countryDialCodes?.[selectedCountry] || '+91';
      setDialCode(countryDialCode);
      setValue('countryCode', countryDialCode);
    }
  }, [selectedCountry, setValue]);

  const onSubmit = (data: Step1Form) => {
    dispatch(setFormData(data));
    dispatch(nextStep());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Full Name</label>
        <input {...register('fullName')} className="w-full border px-3 py-2 rounded-lg" />
        {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
      </div>

      <div>
        <label>Username</label>
        <input {...register('username')} className="w-full border px-3 py-2 rounded-lg" />
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input type="email" {...register('email')} className="w-full border px-3 py-2 rounded-lg" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label>Country</label>
        <select
          {...register('country', { required: 'Country is required' })}
          className="w-full border px-3 py-2 rounded-lg"
        >
          {addressData.countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.country && <p className="text-red-500">{errors.country.message}</p>}
      </div>

      <div>
        <label>Mobile</label>
        <div className="flex">
          <input
            type="text"
            value={dialCode}
            readOnly
            className="w-20 border border-r-0 rounded-l-lg px-2 py-2 bg-gray-200 text-sm"
          />
          <input
            type="tel"
            {...register('mobile', { required: 'Mobile is required' })}
            className="flex-1 border px-3 py-2 rounded-r-lg"
          />
        </div>
        {errors.mobile && <p className="text-red-500">{errors.mobile.message}</p>}
      </div>

      <div>
        <label>Gender</label>
        <select {...register('gender')} className="w-full border px-3 py-2 rounded-lg">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="preferNotToSay">Prefer not to say</option>
        </select>
        {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
      </div>

      <div className="flex justify-end">
        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg">
          Next
        </button>
      </div>
    </form>
  );
};

export default Step1Basic;
