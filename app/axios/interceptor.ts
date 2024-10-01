'use server';

import { AxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';
import { OpenAPIClientAxios } from 'openapi-client-axios';
import type { Client } from './openapi.js';

const DEFAULT_API_BASE_URL = 'http://localhost:3030';
const definition = `${process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL}/api-json`;
const api = new OpenAPIClientAxios({
  definition,
  applyMethodCommonHeaders: true,
  axiosConfigDefaults: {
    baseURL: process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  },
});
await api.init<Client>();
export const client = await api.getClient<Client>();
client.interceptors.request.use(
  (req) => {
    req.headers.Cookie = cookies().toString();

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const request = <T>(options: AxiosRequestConfig): Promise<T | undefined> => {
  const onSuccess = (response: any) => {
    return response.data as T;
  };

  const onError = (error: any) => {
    return Promise.reject(error.response || error.message);
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
