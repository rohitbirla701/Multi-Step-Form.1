import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { set_form_data, next_step, prev_step, upload_profile_pic } from '@/store/slices/formSlice';
import { AppDispatch, RootState } from '@/store';
import { step2Schema } from '@/utils/validationSchema';
import { z } from 'zod';

type Step2Data = z.infer<typeof step2Schema>;

const Step2Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: formData,
    uploading,
    profile_pic_url,
  } = useSelector((state: RootState) => state.form);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    setValue('profilePic', previewUrl);
    dispatch(set_form_data({ ...formData, profilePic: previewUrl }));

    dispatch(upload_profile_pic(file));
  };

  useEffect(() => {
    if (profile_pic_url) {
      setValue('profilePic', profile_pic_url);
      dispatch(set_form_data({ ...formData, profilePic: profile_pic_url }));
      setLocalPreview(null);
    }
  }, [profile_pic_url]);

  const onSubmit = (data: Step2Data) => {
    const finalProfilePic = profile_pic_url || localPreview;
    if (!finalProfilePic) {
      alert('Profile picture is required!');
      return;
    }
    dispatch(set_form_data({ ...data, profilePic: finalProfilePic }));
    dispatch(next_step());
  };

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const profilePicToShow = profile_pic_url || localPreview;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Bio</label>
        <textarea
          {...register('bio')}
          placeholder="Enter your bio"
          className="w-full border px-3 py-2 rounded-lg"
        />
        {errors.bio && <p className="text-red-500">{errors.bio.message as string}</p>}
      </div>

      <div>
        <label>Date of Birth (DD-MM-YYYY)</label>
        <input
          type="text"
          placeholder="DD-MM-YYYY"
          {...register('dob')}
          className="w-full border px-3 py-2 rounded-lg"
        />
        {errors.dob && <p className="text-red-500">{errors.dob.message as string}</p>}
      </div>

      <div>
        <label>Profile Picture (DP)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border px-3 py-2 rounded-lg"
        />
        {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}

        {profilePicToShow && (
          <div className="mt-2 flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-md">
              <img src={profilePicToShow} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {!profilePicToShow && <p className="text-red-500 mt-1">Profile picture is required</p>}
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => dispatch(prev_step())}
          className="px-6 py-2 bg-gray-300 rounded-lg"
        >
          Prev
        </button>
        <button
          type="submit"
          className={`px-6 py-2 rounded-lg text-white ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'}`}
          disabled={uploading}
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default Step2Profile;
