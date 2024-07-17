import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { UserRound } from 'lucide-react';
import { UserProfile } from '@auth0/nextjs-auth0/client';

interface IProps {
  userPicture: UserProfile['picture'];
}

const UserAvatar = ({ userPicture }: IProps) => {
  return (
    <Avatar>
      <AvatarImage src={userPicture ?? ''} alt='user profile picture' />
      <AvatarFallback>
        <UserRound />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
