import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any,
  });

  // Set JWT as HTTP-only cookie, or just return it. For API flexibility, we'll return it in the body
  // but it's often better as a cookie. Let's return it so the frontend can store it securely.
  return token;
};

export default generateToken;
