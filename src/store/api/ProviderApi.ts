// store/api/ProviderApi.ts
import { CasinoProvider, SubProviderResponse } from '@/types';
import { apiSlice } from './apiSlice';

export const casinoGameApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCasinoProviders: builder.query<CasinoProvider[], void>({
      query: () => '/casino-games/providers',
      providesTags: ['Provider'],
    }),

    getSubProvider: builder.query<SubProviderResponse[], {}>({
      query: () => ({
        url: `/casino-games/sub-providers?_t=${Date.now()}`,
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }),
      providesTags: ['SubProvider'],
    }),

    getSubProvidersByName: builder.query<SubProviderResponse[], string[] | string>({
      query: (providerName) => ({
        url: `/casino-games/sub-providers?provider=${providerName}`,
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }),
      providesTags: ['SubProvider'],
    }),

    updateProviderStatus: builder.mutation<
      { success: boolean; provider: CasinoProvider },
      { providerName: string; status: string }
    >({
      query: ({ providerName, status }) => ({
        url: `/casino-games/provider/${providerName}/status`,
        method: 'PATCH',
        body: { status },
      }),
      async onQueryStarted({ providerName, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          casinoGameApi.util.updateQueryData('getCasinoProviders', undefined, (draft) => {
            const provider = draft.find((p) => p.provider === providerName);
            if (provider) provider.status = status;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    //mutation for sub-provider status
    updateSubProviderStatus: builder.mutation<
      { success: boolean; subProvider: SubProviderResponse },
      { providerName: string; subProviderName: string; status: string }
    >({
      query: ({ providerName, subProviderName, status }) => ({
        url: `/casino-games/sub-provider/${providerName}/${subProviderName}/status`,
        method: 'PATCH',
        body: { status },
      }),
      async onQueryStarted(
        { providerName, subProviderName, status },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          casinoGameApi.util.updateQueryData('getSubProvidersByName', providerName, (draft) => {
            const subProvider = draft.find((s) => s.subProvider === subProviderName);
            if (subProvider) subProvider.status = status;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetCasinoProvidersQuery,
  useGetSubProvidersByNameQuery,
  useUpdateProviderStatusMutation,
  useUpdateSubProviderStatusMutation,
  useGetSubProviderQuery,
} = casinoGameApi;
