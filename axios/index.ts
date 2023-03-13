import axios, { AxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(async (req) => {
  const res = await fetch('/api/auth/access_token');
  const accessToken = await res.json();
  req.headers.Authorization = `Bearer ${accessToken}`;

  return req;
});

const request = <T>(options: AxiosRequestConfig): Promise<T | undefined> => {
  const onSuccess = (response: any) => {
    return response.data as T;
  };

  const onError = (error: any) => {
    console.error('Request Failed:', error.config);
    return undefined;
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
