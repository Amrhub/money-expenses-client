'use server';

import axios, { AxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';

const client = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// client.interceptors.request.use(
//   async (req) => {
//     let accessToken = '';
//     if (
//       localStorage &&
//       localStorage.getItem('accessToken') &&
//       localStorage.getItem('accessTokenExpires') &&
//       new Date(+(localStorage.getItem('accessTokenExpires') as string)) > new Date()
//     ) {
//       accessToken = localStorage.getItem('accessToken') as string;
//     } else {
//       const res = await fetch('/api/auth/access_token');
//       if (res.status !== 200) {
//         window.location.pathname = '/api/auth/login';
//         throw new axios.Cancel('Request canceled due to missing auth session.');
//       }

//       accessToken = await res.json();
//     }
//     if (localStorage && accessToken) {
//       localStorage.setItem('accessToken', accessToken);
//       localStorage.setItem('accessTokenExpires', new Date().setHours(24).toString());
//     }
//     req.headers.Authorization = `Bearer ${accessToken}`;

//     return req;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

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
