import { NextApiRequest, NextApiResponse } from 'next';
// pages/api/my-handler.js
import { getAccessToken, Session, AccessTokenErrorCode } from '@auth0/nextjs-auth0';

// const afterRefresh = (req: NextApiRequest, res: NextApiResponse, session: Session) => {
//   // session.user.customProperty = 'foo';
//   delete session.idToken;
//   return session;
// };

export default async function MyHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const accessToken = await getAccessToken(req, res, {
      // refresh: true,
      // afterRefresh,
    });
    res.json(accessToken.accessToken);
  } catch (error: any) {
    console.error('🚀 ~ file: access_token.ts:19 ~ MyHandler ~ error:', error);
    if (
      error.code === AccessTokenErrorCode.MISSING_SESSION ||
      error.code === AccessTokenErrorCode.EXPIRED_ACCESS_TOKEN
    )
      res.status(401).json({ error: 'Missing session' });
  }
}
