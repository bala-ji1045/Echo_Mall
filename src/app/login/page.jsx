// src/app/login/page.jsx
import React from 'react';
import { LoginAction } from '../serveractions/LoginAction';

const Page = () => {
  return (
    <div>
      <h1>Login</h1>
      <form action={LoginAction}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Page;