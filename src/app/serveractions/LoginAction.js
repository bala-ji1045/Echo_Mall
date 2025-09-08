// src/app/serveractions/LoginAction.js
'use server';

import UsersModel from '../utils/models/E_USERS';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function LoginAction(formData) {
  await mongoose.connect(process.env.Mongo_url);

  const email = formData.get('email');
  const password = formData.get('password');

  // Find user by email and password
  const user = await UsersModel.findOne({ email, Password: password });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Generate userId if not exists (user_(length+1))
  let userId = user.userId;
  if (!userId) {
    const userCount = await UsersModel.countDocuments();
    userId = `user_${userCount + 1}`;
    await UsersModel.updateOne({ email }, { $set: { userId } });
  }

  // Hardcode admin email and set isAdmin
  const adminEmail = 'naman@gmail.com';
  const isAdmin = email === adminEmail;

  // Generate JWT token
  const token = jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Set cookie with token and isAdmin (changed to jwt_token)
  cookies().set('jwt_token', token, { httpOnly: true, maxAge: 3600 });
  cookies().set('isAdmin', isAdmin.toString(), { httpOnly: false, maxAge: 3600 });
  // Redirect to /EchoMall (case-sensitive)
  redirect('/echomall');
}