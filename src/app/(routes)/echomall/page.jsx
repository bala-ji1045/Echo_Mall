import React from 'react'
import { cookies } from 'next/headers';
import Admin from '../admin/page';
import Customer from '../customer/page';
import Logout from '@/app/logout/page';
const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const page = () => {
      const cookieStore = cookies();
      const token = cookieStore.get('jwt_token')?.value; // Changed from 'authToken' to 'jwt_token'
      const userData = token ? decodeJwt(token) : null;
      const isadmin= userData?.isAdmin;

  return (
    <div>
        {isadmin ? <Admin/>: <Customer/>}
    </div>
  )
}

export default page