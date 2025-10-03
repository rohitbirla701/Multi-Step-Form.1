import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setFormData, nextStep, prevStep } from '@/store';
import { addressData } from '@/utils/addressData';

interface AddressForm {
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zip: string;
}

const Step3Address: React.FC = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form.data);

  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressForm>({
    defaultValues: formData,
  });

  const selectedCountry = watch('country') || formData.country;
  const selectedState = watch('state');
  const selectedCity = watch('city');

  useEffect(() => {
    if (selectedCountry && addressData.statesByCountry[selectedCountry]) {
      setStates(addressData.statesByCountry[selectedCountry]);
      setValue('state', '');
      setValue('city', '');
      setCities([]);
    }
  }, [selectedCountry, setValue]);

  useEffect(() => {
    if (selectedState && addressData.citiesByState[selectedState]) {
      setCities(addressData.citiesByState[selectedState]);
      setValue('city', '');
    }
  }, [selectedState, setValue]);

  useEffect(() => {
    if (selectedCity && addressData.zipByCity[selectedCity]) {
      setValue('zip', addressData.zipByCity[selectedCity]);
    } else {
      setValue('zip', '');
    }
  }, [selectedCity, setValue]);

  const onSubmit = (data: AddressForm) => {
    dispatch(setFormData(data));
    dispatch(nextStep());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Address Line 1</label>
        <input
          {...register('address1', { required: 'Address is required' })}
          className="w-full border px-3 py-2 rounded-lg"
        />
        {errors.address1 && <p className="text-red-500">{errors.address1.message}</p>}
      </div>

      <div>
        <label>Address Line 2</label>
        <input {...register('address2')} className="w-full border px-3 py-2 rounded-lg" />
      </div>

      <div>
        <label>Country</label>
        <input
          {...register('country')}
          value={selectedCountry}
          readOnly
          className="w-full border px-3 py-2 rounded-lg bg-gray-200"
        />
      </div>

      <div>
        <label>State</label>
        <select
          {...register('state', { required: 'State is required' })}
          className="w-full border px-3 py-2 rounded-lg"
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.state && <p className="text-red-500">{errors.state.message}</p>}
      </div>

      <div>
        <label>City</label>
        <select
          {...register('city', { required: 'City is required' })}
          className="w-full border px-3 py-2 rounded-lg"
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.city && <p className="text-red-500">{errors.city.message}</p>}
      </div>

      <div>
        <label>Zip</label>
        <input
          {...register('zip', { required: 'Zip is required' })}
          placeholder="Auto-filled based on city"
          className="w-full border px-3 py-2 rounded-lg"
        />
        {errors.zip && <p className="text-red-500">{errors.zip.message}</p>}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => dispatch(prevStep())}
          className="px-6 py-2 bg-gray-300 rounded-lg"
        >
          Prev
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg">
          Next
        </button>
      </div>
    </form>
  );
};

export default Step3Address;
