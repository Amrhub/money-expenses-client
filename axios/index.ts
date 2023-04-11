import axios, { AxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(async (req) => {
  let accessToken = '';
  if (
    localStorage &&
    localStorage.getItem('accessToken') &&
    localStorage.getItem('accessTokenExpires') &&
    new Date(+(localStorage.getItem('accessTokenExpires') as string)) > new Date()
  ) {
    accessToken = localStorage.getItem('accessToken') as string;
  } else {
    const res = await fetch('/api/auth/access_token');
    accessToken = await res.json();
  }
  if (localStorage) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('accessTokenExpires', new Date().setHours(24).toString());
  }
  req.headers.Authorization = `Bearer ${accessToken}`;

  return req;
});

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
