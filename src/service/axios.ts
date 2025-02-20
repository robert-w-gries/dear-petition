import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { loggedOut } from '../slices/auth';
import { CSRF_COOKIE_NAME, CSRF_HEADER_KEY } from '../constants/authConstants';
import { BaseQueryApi, QueryReturnValue } from '@reduxjs/toolkit/query';

const Axios = axios.create({
  baseURL: `/petition/api/`,
  timeout: 5 * 1000,
  withCredentials: true, // allow setting/passing cookies
  xsrfCookieName: CSRF_COOKIE_NAME,
  xsrfHeaderName: CSRF_HEADER_KEY,
});

export default Axios;

export type AxiosBaseQueryArgs = AxiosRequestConfig & { url: string; method: Method };
export type AxiosBaseQueryReturnValue = QueryReturnValue<
  unknown,
  Pick<AxiosResponse<unknown>, 'status' | 'data'>,
  { request: AxiosBaseQueryArgs; response: AxiosResponse }
>;

const isAxiosError = (data: unknown): data is AxiosError<unknown> =>
  typeof data === 'object' && !!data && 'response' in data;

export const axiosBaseQuery =
  (initialApi?: BaseQueryApi) =>
  async (
    { url, method, timeout, data, params, responseType }: AxiosBaseQueryArgs,
    api: BaseQueryApi,
  ): Promise<AxiosBaseQueryReturnValue> => {
    const currentApi = api ?? initialApi;
    if (!currentApi) {
      throw new Error('Must provide api instance');
    }
    const requestConfig: AxiosBaseQueryArgs = { url, method, data, params, responseType, timeout: undefined };
    if (timeout) {
      requestConfig.timeout = timeout;
    }
    try {
      const result = await Axios(requestConfig);
      return { data: result.data, meta: { request: requestConfig, response: result } };
    } catch (error: unknown) {
      // Early return if we get unknown error or error is not related to authentication
      if (!isAxiosError(error) || !error.response) {
        throw error;
      }

      const isLoginAttempt = url === 'token/' && method.localeCompare('post', 'en', { sensitivity: 'base' }) === 0;
      if (error?.response.status !== 401 || isLoginAttempt) {
        return {
          error: { status: error.response.status, data: error.response.data },
        };
      }
    }

    // retry logic - use refresh token to get new access key and try again
    try {
      await Axios({ url: 'token/refresh/', method: 'post' });
      const result = await Axios(requestConfig); // retry
      return { data: result.data, meta: { request: requestConfig, response: result } };
    } catch (error) {
      currentApi.dispatch(loggedOut());
      if (!isAxiosError(error) || !error.response) {
        throw error;
      }
      return {
        error: { status: error.response?.status, data: error.response?.data },
      };
    }
  };

export const manualAxiosRequest = async ({ url, method, timeout, data, params, responseType }: AxiosBaseQueryArgs) => {
  const store = (await import('../store')).default;
  const result = await axiosBaseQuery()(
    { url, method, timeout, data, params, responseType },
    store as unknown as BaseQueryApi, // TODO: how do we get the actual api here
  );
  if ('error' in result) {
    throw result.error;
  }
  return result;
};
