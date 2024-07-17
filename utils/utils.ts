import { UserProfile } from "@auth0/nextjs-auth0/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export function getFirstLetterFromUser(user: UserProfile) {
  if (user.nickname) {
    return user.nickname[0].toUpperCase();
  }

  if (user.name) {
    return user.name[0].toUpperCase();
  }

  if (user.email) {
    return user.email[0].toUpperCase();
  }

  return 'N/A';
}

export function logOut(router: AppRouterInstance) {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('accessTokenExpires');
  router.push('/api/auth/logout');
}