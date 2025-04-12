import { createApi, TagDescription } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axios';
import {
  Agency,
  Attorney,
  Batch,
  Category,
  Client,
  Id,
  ImportResults,
  PaginatedResults,
  Petition,
  User,
} from './types';
import { Method } from 'axios';

const TAG_TYPES = ['ContactList', 'ContactFilterOptions', 'Batch', 'Petition', 'User'] as const;
const invalidatesTagsWithResult = (tags: TagDescription<(typeof TAG_TYPES)[number]>[]) => (result?: unknown) =>
  result ? tags : [];

export const api = createApi({
  // TODO: use baseUrl here instead of in axios
  baseQuery: axiosBaseQuery(),
  tagTypes: TAG_TYPES,
  endpoints: (builder) => ({
    agencies: builder.query<Agency[], { queryString: string }>({
      query: ({ queryString }) => ({
        url: `agency/?${queryString}`,
        method: 'get',
      }),
      providesTags: [{ type: 'ContactList', id: 'agency' }],
    }),
    createAgency: builder.mutation<Agency, { data: Omit<Agency, 'pk'> }>({
      query: ({ data }) => ({ url: `agency/`, method: 'post', data }),
      invalidatesTags: invalidatesTagsWithResult([
        { type: 'ContactList', id: 'agency' },
        { type: 'ContactFilterOptions', id: 'agency' },
      ]),
    }),
    updateAgency: builder.mutation<Agency, { id: number; data: Omit<Agency, 'pk'> }>({
      query: ({ id, data }) => ({ url: `agency/${id}/`, method: 'put', data }),
      invalidatesTags: invalidatesTagsWithResult([
        { type: 'ContactList', id: 'agency' },
        { type: 'ContactFilterOptions', id: 'agency' },
      ]),
    }),
    searchAttornies: builder.query<PaginatedResults<Attorney>, { search: string }>({
      query: ({ search }) => ({
        url: `contact/?category=attorney&search=${search}`,
        method: 'get',
      }),
    }),
    searchAgencies: builder.query<PaginatedResults<Agency>, { search: string }>({
      query: ({ search }) => ({
        url: `agency/?search=${search}`,
        method: 'get',
      }),
    }),
    createClient: builder.mutation<Client, { data: Omit<Client, 'pk' | 'user' | 'batches'> }>({
      query: ({ data }) => ({ url: `client/`, method: 'post', data }),
    }),
    updateClient: builder.mutation<Client, { id: number; data: Omit<Client, 'pk'> }>({
      query: ({ id, data }) => ({ url: `client/${id}/`, method: 'put', data }),
      invalidatesTags: (result) => {
        if (!result) {
          return [];
        }
        const tags = [
          { type: 'ContactList', id: result.category },
          { type: 'ContactFilterOptions', id: result.category },
        ] as TagDescription<'ContactList' | 'ContactFilterOptions' | 'Batch'>[];
        result?.batches?.forEach((batchId) => tags.push({ type: 'Batch', id: batchId }));
        return tags;
      },
    }),
    deleteAgency: builder.mutation<Record<string, never>, { id: number }>({
      query: ({ id }) => ({ url: `agency/${id}/`, method: 'delete' }),
      invalidatesTags: invalidatesTagsWithResult([
        { type: 'ContactList', id: 'agency' },
        { type: 'ContactFilterOptions', id: 'agency' },
      ]),
    }),
    previewImportAgencies: builder.mutation<ImportResults, unknown>({
      query: ({ data }) => ({ url: `agency/preview_import_agencies/`, method: 'put', data }),
    }),
    importAgencies: builder.mutation<Record<string, never>, unknown>({
      query: ({ data }) => ({ url: `agency/import_agencies/`, method: 'put', data }),
      invalidatesTags: invalidatesTagsWithResult([{ type: 'ContactList', id: 'agency' }]),
    }),
    searchClients: builder.query<PaginatedResults<Client>, { search: string }>({
      query: ({ search }) => ({
        url: `client/?search=${search}`,
        method: 'get',
      }),
    }),
    getContactFilterOptions: builder.query<string[], { params: { field: string; category: Category; search: string } }>(
      {
        query: ({ params }) => ({ url: 'contact/get_filter_options/', method: 'get', params }),
        providesTags: (_result, _error, { params: { category } }) => [{ type: 'ContactFilterOptions', id: category }],
      },
    ),
    checkLogin: builder.query<{ user: User }, Record<string, never>>({
      query: () => ({ url: 'token/', method: 'get' }),
    }),
    createBatch: builder.mutation<{ id: Id }, unknown>({
      query: ({ data }) => ({ url: 'batch/', method: 'post', timeout: 30 * 1000, data }),
      invalidatesTags: invalidatesTagsWithResult(['Batch']),
    }),
    createBatchFromRecordSpreadsheet: builder.mutation<{ batch_id: Id }, unknown>({
      query: ({ data }) => ({ url: `batch/import_spreadsheet/`, method: 'post', timeout: 30 * 1000, data }),
      invalidatesTags: invalidatesTagsWithResult(['Batch']),
    }),
    deleteBatch: builder.mutation<Record<string, never>, { id: Id }>({
      query: ({ id }) => ({ url: `batch/${id}/`, method: 'delete' }),
      invalidatesTags: invalidatesTagsWithResult(['Batch']),
    }),
    updateBatch: builder.mutation<Batch, { id: number; data: unknown }>({
      query: ({ id, data }) => ({ url: `batch/${id}/`, method: 'put', data }),
      invalidatesTags: (result, _err, { id }) => {
        const tags = [{ type: 'Batch', id }] as TagDescription<'Petition' | 'Batch'>[];
        result?.petitions?.forEach(({ pk }) => tags.push({ type: 'Petition', id: pk }));
        return tags;
      },
    }),
    getBatch: builder.query<Batch, { id: number }>({
      query: ({ id }) => ({ url: `batch/${id}/`, method: 'get', timeout: 30 * 1000 }),
      providesTags: (result, _err, { id }) => {
        const tags = [{ type: 'Batch', id }] as TagDescription<'Batch' | 'Petition'>[];
        // TODO: Add petitions from this result to redux store
        if (result?.petitions) {
          tags.concat(result.petitions.map(({ pk }) => ({ type: 'Petition', id: pk })));
        }
        return tags;
      },
    }),
    getUserBatches: builder.query<PaginatedResults<Batch>, { user: string; limit: number; offset: number }>({
      query: ({ user, limit, offset }) => ({ url: `batch/`, method: 'get', params: { user, limit, offset } }),
      providesTags: ['Batch'],
    }),
    combineBatches: builder.mutation<Batch, { batchIds: Id[]; label: string }>({
      query: (data) => ({ url: 'batch/combine_batches/', method: 'post', data }),
      invalidatesTags: invalidatesTagsWithResult(['Batch']),
    }),
    login: builder.mutation<{ detail: string } & { user: User }, { username: string; password: string }>({
      query: (data) => ({ url: 'token/', method: 'post', data }),
    }),
    logout: builder.mutation<{ detail: string }, Record<string, never>>({
      query: () => ({ url: 'token/', method: 'delete' }),
    }),
    users: builder.query<PaginatedResults<User>, { queryString: string; id?: Id }>({
      query: ({ queryString, id }) => {
        let url = 'users/';
        if (id) {
          url = `${url}/${id}/`;
        }
        url = `${url}?${queryString}`;
        return { url, method: 'get' };
      },
      providesTags: ['User'],
    }),
    createUser: builder.mutation<User, { email: string; is_admin: boolean; username: string }>({
      query: (params) => ({ url: `users/`, method: 'post', data: { ...params } }),
      invalidatesTags: invalidatesTagsWithResult(['User']),
    }),
    modifyUser: builder.mutation<
      User,
      { id: Id; method: Method; data: { email: string; is_admin: boolean; username: string } }
    >({
      query: ({ id, data, method = 'put' }) => ({ url: `users/${id}/`, method, data }),
      invalidatesTags: invalidatesTagsWithResult(['User']),
    }),
    petition: builder.query<Petition, { petitionId: Id }>({
      query: ({ petitionId }) => ({ url: `/petitions/${petitionId}/`, method: 'GET' }),
      providesTags: (_result, _err, { petitionId }) => [{ type: 'Petition', id: petitionId }],
    }),
    recalculatePetitions: builder.mutation<Petition, { petitionId: Id; offenseRecordIds: Id[] }>({
      query: ({ petitionId, offenseRecordIds }) => ({
        url: `/petitions/${petitionId}/recalculate_petitions/`,
        data: { offense_record_ids: offenseRecordIds },
        method: 'POST',
      }),
      invalidatesTags: (result, _err, { petitionId }) => [
        { type: 'Batch', id: result?.batch },
        { type: 'Petition', id: petitionId },
      ],
    }),
    assignAgenciesToDocuments: builder.mutation<Petition, { petitionId: Id; agencies: Agency[] }>({
      query: ({ petitionId, agencies }) => ({
        url: `/petitions/${petitionId}/assign_agencies_to_documents/`,
        method: 'post',
        data: { agencies },
      }),
      invalidatesTags: (result, _err, { petitionId }) => [
        { type: 'Batch', id: result?.batch },
        { type: 'Petition', id: petitionId },
      ],
    }),
    assignClientToBatch: builder.mutation<{ batch_id: Id }, { batchId: Id; data: { client_id: number } }>({
      query: ({ batchId, data }) => ({
        url: `/batch/${batchId}/assign_client_to_batch/`,
        method: 'post',
        data: data,
      }),
      invalidatesTags: (result) => {
        if (!result) {
          return [];
        }
        return ['ContactList', 'ContactFilterOptions', { type: 'Batch', id: result.batch_id }];
      },
    }),
  }),
});

export const {
  useAgenciesQuery,
  useCreateAgencyMutation,
  useUpdateAgencyMutation,
  useLazyAgenciesQuery,
  useLazySearchAgenciesQuery,
  useLazySearchAttorniesQuery,
  useLazySearchClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteAgencyMutation,
  useImportAgenciesMutation,
  usePreviewImportAgenciesMutation,
  useAssignAgenciesToDocumentsMutation,
  useLazyGetContactFilterOptionsQuery,
  useCreateBatchMutation,
  useCreateBatchFromRecordSpreadsheetMutation,
  useDeleteBatchMutation,
  useCombineBatchesMutation,
  useLazyCheckLoginQuery,
  useGetBatchQuery,
  useGetUserBatchesQuery,
  useUpdateBatchMutation,
  useLoginMutation,
  useLogoutMutation,
  usePetitionQuery,
  useRecalculatePetitionsMutation,
  useCreateUserMutation,
  useModifyUserMutation,
  useUsersQuery,
  useAssignClientToBatchMutation,
} = api;
