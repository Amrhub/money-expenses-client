// pages/api/auth/[...auth0].js
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
    },
  }),
  onError: (error, req, res) => {
    console.error('🚀 ~ file: [...auth0].ts:15 ~ error:', error);
  },
});
