import { CasinoGame, CasinoGameApiResponse, GetCasinoGamesParams } from '@/types';
import { apiSlice } from './apiSlice';

export const casinoGameApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCasinoGames: builder.query<CasinoGameApiResponse<CasinoGame[]>, GetCasinoGamesParams>({
      query: ({ skip, take, search, providers, subProviders }) => ({
        url: '/casino-games',
        params: {
          ...(skip !== undefined && { skip }),
          ...(take !== undefined && { take }),
          ...(search && { search }),
          ...(providers && providers.length > 0 && { providers }),
          ...(subProviders && subProviders.length > 0 && { subProviders }),
          _t: Date.now(),
        },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }),
      providesTags: ['CasinoGames'],
    }),

    updateCasinoGameStatus: builder.mutation<
      { success: boolean; message: string },
      { id: string; status: 'ACTIVE' | 'INACTIVE' }
    >({
      query: ({ id, status }) => ({
        url: `/casino-games/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      // ✅ Optimistic update
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled, getState }) {
        // Optimistically update ALL cached queries for getCasinoGames
        const patchResults: any[] = [];
        const state: any = getState();

        // Loop over all cached queries of getCasinoGames
        const queries = casinoGameApi.util.selectInvalidatedBy(state, ['CasinoGames']);
        for (const { originalArgs } of queries) {
          const patch = dispatch(
            casinoGameApi.util.updateQueryData('getCasinoGames', originalArgs, (draft) => {
              const game = draft.data.find((g) => g.id === id);
              if (game) {
                game.status = status;
              }
            })
          );
          patchResults.push(patch);
        }

        try {
          await queryFulfilled; // wait for server response
        } catch {
          // rollback all optimistic patches if server fails
          patchResults.forEach((p) => p.undo());
        }
      },
      invalidatesTags: ['CasinoGames'],
    }),
  }),
});

export const { useGetCasinoGamesQuery, useUpdateCasinoGameStatusMutation,} = casinoGameApi;
