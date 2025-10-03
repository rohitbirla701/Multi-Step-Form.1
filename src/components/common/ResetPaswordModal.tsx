import React, { useState } from 'react';

// Assuming you have a UI library or custom components for styling like shadcn/ui
// If not, you'll need to replace these with standard HTML elements and your own CSS classes.
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'; // Replace with your actual dialog component import
import { Input } from '@/components/ui/input'; // Replace with your actual input component import
import { Button } from '@/components/ui/button'; // Replace with your actual button component import
import { Eye, EyeOff, X } from 'lucide-react'; // Assuming you have lucide-react for icons

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (userId: string, oldPass: string, newPass: string) => void;
  initialUserId?: string; // Optional: if you want to pre-fill the User ID
}

const ResetPasswordModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  initialUserId = '',
}) => {
  const [userId, setUserId] = useState<string>(initialUserId);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const handleUpdate = () => {
    // Basic validation
    if (!userId || !oldPassword || !newPassword) {
      alert('Please fill in all required fields.');
      return;
    }
    onUpdate(userId, oldPassword, newPassword);
    // Optionally close the modal and reset fields after update
    onClose();
    setOldPassword('');
    setNewPassword('');
  };

  const handleCancel = () => {
    onClose();
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 bg-white rounded-lg shadow-xl">
        <DialogHeader className="flex justify-between items-center flex-row pb-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-800">Reset Password</DialogTitle>
          <DialogClose asChild>
            {/* <Button variant="ghost" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-5 w-5 text-gray-500" />
              <span className="sr-only">Close</span>
            </Button> */}
          </DialogClose>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* User ID */}
          <div className="space-y-2">
            <label htmlFor="userId" className="text-sm font-medium text-gray-700">
              User Id
            </label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              readOnly={!!initialUserId} // Make read-only if initialUserId is provided
            />
          </div>

          {/* Old Password */}
          <div className="space-y-2">
            <label htmlFor="oldPassword" className="text-sm font-medium text-gray-700">
              Old Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="oldPassword"
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-1 block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-gray-500 hover:bg-gray-100"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">
                  {showOldPassword ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-gray-500 hover:bg-gray-100"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">
                  {showNewPassword ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
