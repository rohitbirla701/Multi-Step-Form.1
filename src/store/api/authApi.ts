import { apiSlice } from './apiSlice';
import { User, LoginCredentials, RegisterData, AuthTokens, ApiResponse } from '@/types';
import { mockAuthService } from '@/utils/mockAuth';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ type: string; accessToken: string },
      LoginCredentials
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<
      ApiResponse<{ user: User; tokens: AuthTokens }>,
      RegisterData
    >({
      queryFn: async (userData) => {
        try {
          const data = await mockAuthService.register(userData);
          return { data };
        } catch (error: any) {
          return { error: error.response?.data || { message: 'Registration failed' } };
        }
      },
      invalidatesTags: ['Auth'],
    }),
    
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    refreshToken: builder.mutation<ApiResponse<AuthTokens>, { refreshToken: string }>({
      queryFn: async ({ refreshToken }) => {
        try {
          const data = await mockAuthService.refreshToken(refreshToken);
          return { data };
        } catch (error: any) {
          return { error: error.response?.data || { message: 'Token refresh failed' } };
        }
      },
    }),
    
    getCurrentUser: builder.query<ApiResponse<User>, string>({
      queryFn: async (token) => {
        try {
          const data = await mockAuthService.getCurrentUser(token);
          return { data };
        } catch (error: any) {
          return { error: error.response?.data || { message: 'Failed to get user' } };
        }
      },
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
} = authApi;