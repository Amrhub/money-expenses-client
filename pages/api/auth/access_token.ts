import { NextApiRequest, NextApiResponse } from 'next';
// pages/api/my-handler.js
import { getAccessToken, Session } from '@auth0/nextjs-auth0';

// const afterRefresh = (req: NextApiRequest, res: NextApiResponse, session: Session) => {
//   session.user.customProperty = 'foo';
//   delete session.idToken;
//   return session;
// };

export default async function MyHandler(req: NextApiRequest, res: NextApiResponse) {
  const accessToken = await getAccessToken(req, res, {
    // refresh: true,
    // afterRefresh,
  });

  res.json(accessToken.accessToken);
}
