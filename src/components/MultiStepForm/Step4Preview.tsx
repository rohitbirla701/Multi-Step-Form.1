import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppDispatch,
  RootState,
  prev_step,
  reset_form,
  update_form_field,
  upload_profile_pic,
} from '@/store';
import { Pencil } from 'lucide-react';

const Step4Preview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: formData,
    uploading,
    profile_pic_url,
  } = useSelector((state: RootState) => state.form);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value || '');
  };

  const handleSave = (field: string) => {
    dispatch(update_form_field({ field, value: tempValue }));
    setEditingField(null);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    dispatch(update_form_field({ field: 'profilePic', value: previewUrl }));
    dispatch(upload_profile_pic(file));
  };

  const profilePicToShow = profile_pic_url || formData.profilePic || null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Preview</h2>

      <div className="flex flex-col items-center space-y-2">
        {profilePicToShow ? (
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-md">
            <img src={profilePicToShow} alt="Profile" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            No Photo
          </div>
        )}
        <label className="cursor-pointer text-blue-500 text-sm">
          {uploading ? 'Uploading...' : 'Change Photo'}
          <input type="file" accept="image/*" onChange={handleProfileChange} className="hidden" />
        </label>
      </div>
      <div className="bg-gray-100 p-4 w-80 md:w-full rounded-lg space-y-3">
        {Object.entries(formData)
          .filter(([key]) => key !== 'profilePic')
          .map(([key, value]) => (
            <div key={key} className="flex items-start justify-between flex-wrap">
              <div className="flex-1 min-w-[120px]">
                <b>{key}:</b>{' '}
                {editingField === key ? (
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <span className="break-words">{String(value)}</span>
                )}
              </div>
              {editingField === key ? (
                <button
                  onClick={() => handleSave(key)}
                  className="text-green-600 text-sm ml-2 mt-1"
                >
                  Save
                </button>
              ) : (
                <Pencil
                  className="w-4 h-4 text-blue-500 cursor-pointer mt-1"
                  onClick={() => handleEdit(key, String(value))}
                />
              )}
            </div>
          ))}
      </div>

      <div className="flex justify-between">
        <button onClick={() => dispatch(prev_step())} className="px-6 py-2 bg-gray-300 rounded-lg">
          Prev
        </button>
        <button
          onClick={() => dispatch(reset_form())}
          className="px-6 py-2 bg-green-500 text-white rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Step4Preview;
