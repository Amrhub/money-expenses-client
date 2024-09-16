// pages/api/my-handler.js
import { AccessTokenErrorCode, getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

// const afterRefresh = (req: NextApiRequest, res: NextApiResponse, session: Session) => {
//   // session.user.customProperty = 'foo';
//   delete session.idToken;
//   return session;
// };

export async function GET(req: Request, res: Response) {
  console.log(`🚀 ~ GET ~ req:`, req)
  try {
    const {accessToken} = await getAccessToken();
    return NextResponse.json(accessToken);
  } catch (error: any) {
    console.error('🚀 ~ file: access_token.ts:19 ~ MyHandler ~ error:', error);
    if (
      error.code === AccessTokenErrorCode.MISSING_SESSION ||
      error.code === AccessTokenErrorCode.EXPIRED_ACCESS_TOKEN
    )
      // res.status(401).json({ error: 'Missing session' });
      return NextResponse.error();
  }
}
