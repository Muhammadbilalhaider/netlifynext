import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { CustomRequest } from '../interfaces/commonInterfaces';
import { RESPONSE_CODES } from '../config/constants';
import { RESPONSE_MESSAGES } from './responseMessage';

interface User {
  // Define the properties of your user object here
  // For example: id: string;
}

const generateToken = (user: User): string => {

  return jwt.sign(user, process.env.JWT_SECRET_KEY as string, { expiresIn: '15d' });
};

const refreshToken = (user: User): string => {
  return jwt.sign({ user }, process.env.JWT_SECRET_KEY as string, { expiresIn: '7d' });
};

const verifyToken = (req: CustomRequest): User | null => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      if (verifyToken) {
        req.user = verifyToken;
        return {
          status: 1,
          status_code: RESPONSE_CODES.GET,
          message: RESPONSE_MESSAGES.tokenVerified,
          data: verifyToken
        }
      }
    }
    return null;
  } catch (error) {
    return {
      status: 0,
      status_code: RESPONSE_CODES.UNAUTHORIZED,
      message: RESPONSE_MESSAGES.invalidToken
    }
  }
};

const generateHash = async (text: string): Promise<string> => {
  const hash = await bcrypt.hash(text, 10);
  return hash;
};

export {
  verifyToken,
  generateToken,
  refreshToken,
  generateHash
};
