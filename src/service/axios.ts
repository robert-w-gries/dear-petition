import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { loggedOut } from '/src/slices/auth';
import { CSRF_COOKIE_NAME, CSRF_HEADER_KEY } from '/src/constants/authConstants';
import { isNullish, isObject } from '/src/types';

const Axios = axios.create({
  baseURL: `/petition/api/`,
  timeout: 5 * 1000,
  withCredentials: true, // allow setting/passing cookies
  xsrfCookieName: CSRF_COOKIE_NAME,
  xsrfHeaderName: CSRF_HEADER_KEY,
});

export default Axios;

const isAxiosError = (error: unknown): error is AxiosError<unknown> =>
  isObject(error) && 'isAxiosError' in error && !!error.isAxiosError;

type QueryArgs = {
  url: string;
  method: Method;
  params?: unknown;
  data?: unknown;
  timeout?: number;
};
export const axiosBaseQuery =
  (): BaseQueryFn<QueryArgs> =>
  async ({ url, method, timeout, data, params }, api) => {
    const requestConfig: AxiosRequestConfig = {
      url,
      method,
      data,
      params,
      ...(!isNullish(timeout) && { timeout }),
    };
    try {
      const result = await Axios(requestConfig);
      return { data: result.data };
    } catch (error: unknown) {
      const isLoginAttempt =
        url === 'token/' && method.localeCompare('post', 'en', { sensitivity: 'base' }) === 0;
      if (!isAxiosError(error)) {
        return { error: 'Unknown error' };
      }
      if (error.response?.status !== 401 || isLoginAttempt) {
        return {
          error: { status: error.response?.status, data: error.response?.data },
        };
      }
    }

    // retry logic - use refresh token to get new access key and try again
    try {
      await Axios({ url: 'token/refresh/', method: 'post' });
      const result = await Axios(requestConfig); // retry
      return { data: result.data };
    } catch (error) {
      api.dispatch(loggedOut());
      if (!isAxiosError(error)) {
        return { error: 'Unknown Error' };
      }
      return {
        error: { status: error.response?.status, data: error.response?.data },
      };
    }
  };

export const manualAxiosRequest = axiosBaseQuery();
