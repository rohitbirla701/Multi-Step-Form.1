import toast from 'react-hot-toast';
import { apiSlice } from './apiSlice';
import { UserManagementData, GetUsersParams, UserApiResponse, UserInfoByNameId } from '@/types';

export const userApi = apiSlice.injectEndpoints({
  // Get All User Data
  endpoints: (builder) => ({
    getUsers: builder.query<UserApiResponse<UserManagementData[]>, GetUsersParams>({
      query: ({ skip, take, search }) => ({
        url: '/users',
        params: { skip, take, ...(search ? { search } : {}), _t: Date.now() },
      }),
      providesTags: ['User'],
    }),

    // Get User Info By Name And Id or Exclusive Id
    getUserByIdAndName: builder.query<UserInfoByNameId, { userId?: string; username?: string }>({
      query: ({ userId, username }) => {
        const params: { userId?: string; username?: string } = {};
        if (userId) params.userId = userId;
        if (username) params.username = username;

        return {
          url: `/users/activity/info`,
          params,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, { userId }) => (userId ? [{ type: 'User', id: userId }] : []),
    }),

    // Update User Status
    statusUpdate: builder.mutation<any, { userId: number; status: string }>({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/${status}`,
        method: 'POST',
        body: { status },
      }),
      async onQueryStarted({ userId, status }, { dispatch, queryFulfilled }) {
        // Optimistically update the cache
        const patchResult = dispatch(
          userApi.util.updateQueryData('getUsers', { skip: 0, take: 10, search: '' }, (draft) => {
            const user = draft.data.find((u) => u.id === userId);
            if (user) {
              user.status = status; // change immediately
            }
          })
        );
        try {
          await queryFulfilled;
          toast.success(`User status updated to "${status}"`);
        } catch {
          patchResult.undo(); // rollback if API fails
          toast.error('Failed to update user status');
        }
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useStatusUpdateMutation,
  useLazyGetUserByIdAndNameQuery,
  useLazyGetUsersQuery,
} = userApi;
