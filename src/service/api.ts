import { createApi } from '@reduxjs/toolkit/query/react';
import { EmptyRequest, EmptyResponse, ListView, QuerysetParams } from '~/src/types/ApiTypes';
import { ArrestingAgency, Attorney, CIPRSRecord, Petition, User } from '~/src/types/DataTypes';
import { axiosBaseQuery } from './axios';

export const api = createApi({
  // TODO: use baseUrl here instead of in axios.js
  baseQuery: axiosBaseQuery(),
  tagTypes: ['AgencyList', 'ContactFilterOptions', 'Petition', 'User'],
  endpoints: (builder) => ({
    // auth
    login: builder.mutation<{ user: User; detail: string }, { username: string; password: string }>(
      {
        query: (data) => ({ url: 'token/', method: 'post', data }),
      }
    ),
    logout: builder.mutation<{ detail: string }, EmptyRequest>({
      query: () => ({ url: 'token/', method: 'delete' }),
    }),
    checkLogin: builder.query<{ user: User }, EmptyRequest>({
      query: () => ({ url: 'token/', method: 'get' }),
    }),

    // arresting agencies
    agencies: builder.query<ListView<ArrestingAgency>, { queryString: string }>({
      query: ({ queryString }) => ({
        url: `contact/?category=agency&${queryString}`,
        method: 'get',
      }),
      providesTags: ['AgencyList'],
    }),
    searchAgencies: builder.query<ListView<ArrestingAgency>, { search: string }>({
      query: ({ search }) => ({
        url: `contact/?category=agency&search=${search}`,
        method: 'get',
      }),
    }),
    createAgency: builder.mutation<
      ArrestingAgency,
      { data: Omit<ArrestingAgency, 'pk' | 'formatted_address'> }
    >({
      query: ({ data }) => ({ url: `contact/`, method: 'post', data }),
      invalidatesTags: ['AgencyList', 'ContactFilterOptions'],
    }),
    deleteAgency: builder.mutation<EmptyResponse, { id: number }>({
      query: ({ id }) => ({ url: `contact/${id}/`, method: 'delete' }),
      invalidatesTags: ['AgencyList', 'ContactFilterOptions'],
    }),
    updateAgency: builder.mutation<
      ArrestingAgency,
      { id: number; data: Omit<ArrestingAgency, 'pk' | 'formatted_address'> }
    >({
      query: ({ id, data }) => ({ url: `contact/${id}/`, method: 'put', data }),
      invalidatesTags: ['AgencyList', 'ContactFilterOptions'],
    }),

    // attornies
    searchAttornies: builder.query<ListView<Attorney>, { search: string }>({
      query: ({ search }) => ({
        url: `/contact/?category=attorney&search=${search}`,
        method: 'get',
      }),
    }),

    // contacts
    getContactFilterOptions: builder.query<
      unknown[],
      { params: { field: string; category: string; search: string } }
    >({
      query: ({ params }) => ({ url: 'contact/get_filter_options/', method: 'get', params }),
      providesTags: (result) => (result ? ['ContactFilterOptions'] : []),
    }),

    // batch
    createBatch: builder.mutation<{ id: number }, { data: unknown }>({
      query: ({ data }) => ({ url: 'batch/', method: 'post', timeout: 30 * 1000, data }),
    }),
    getBatch: builder.query<
      {
        pk: number;
        label: string;
        date_uploaded: string;
        user: number;
        records: CIPRSRecord[];
        petitions: Petition[];
      },
      { id: number }
    >({
      query: ({ id }) => ({ url: `batch/${id}/`, method: 'get' }),
      providesTags: (result) =>
        result?.petitions ? result.petitions.map(({ pk }) => ({ type: 'Petition', id: pk })) : [],
    }),

    // petition
    petition: builder.query<Petition, { petitionId: number }>({
      query: ({ petitionId }) => ({ url: `/petitions/${petitionId}/`, method: 'GET' }),
      providesTags: (_result, _err, { petitionId }) => [{ type: 'Petition', id: petitionId }],
    }),
    recalculatePetitions: builder.mutation<
      Petition,
      { petitionId: number; offenseRecordIds: number[] }
    >({
      query: ({ petitionId, offenseRecordIds }) => ({
        url: `/petitions/${petitionId}/recalculate_petitions/`,
        data: { offense_record_ids: offenseRecordIds },
        method: 'POST',
      }),
      invalidatesTags: (_result, _err, { petitionId }) => [{ type: 'Petition', id: petitionId }],
    }),
    assignAgenciesToDocuments: builder.mutation<
      Petition,
      { petitionId: number; agencies: ArrestingAgency[] }
    >({
      query: ({ petitionId, agencies }) => ({
        url: `/petitions/${petitionId}/assign_agencies_to_documents/`,
        method: 'post',
        data: { agencies },
      }),
      invalidatesTags: (_result, _err, { petitionId }) => [{ type: 'Petition', id: petitionId }],
    }),

    // user
    users: builder.query<ListView<User>, { params: QuerysetParams }>({
      query: ({ params }) => ({ url: 'users/', method: 'get', params }),
      providesTags: ['User'],
    }),
    createUser: builder.mutation<User, { data: Pick<User, 'username' | 'email' | 'is_admin'> }>({
      query: (data) => ({ url: 'users/', method: 'post', data }),
      invalidatesTags: ['User'],
    }),
    modifyUser: builder.mutation<
      User,
      { id: number; data: Pick<User, 'username' | 'email' | 'is_admin'> }
    >({
      query: ({ id, data }) => ({ url: `users/${id}/`, method: 'PUT', data }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<EmptyResponse, { id: number }>({
      query: ({ id }) => ({ url: `users/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useAgenciesQuery,
  useLazyAgenciesQuery,
  useLazySearchAgenciesQuery,
  useLazySearchAttorniesQuery,
  useCreateAgencyMutation,
  useDeleteAgencyMutation,
  useUpdateAgencyMutation,
  useAssignAgenciesToDocumentsMutation,
  useLazyGetContactFilterOptionsQuery,
  useCreateBatchMutation,
  useLazyCheckLoginQuery,
  useGetBatchQuery,
  useLoginMutation,
  useLogoutMutation,
  usePetitionQuery,
  useRecalculatePetitionsMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useModifyUserMutation,
  useUsersQuery,
} = api;
