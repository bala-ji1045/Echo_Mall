// src/app/Components/LayoutSelector.jsx
import React from 'react';

import UserNavBar from '../Components/UserNavBar';
import { cookies } from 'next/headers';

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

const LayoutSelector = ({ children }) => {
  const cookieStore = cookies();
  const token = cookieStore.get('jwt_token')?.value; // Changed from 'authToken' to 'jwt_token'
  const userData = token ? decodeJwt(token) : null;
  const isAuthenticated = !!userData;

  return (
    <>
    
      {isAuthenticated ? <UserNavBar /> : null}
      <main style={{ marginTop: '30px' }}>{children}</main>
    </>
  );
};

export default LayoutSelector;