import * as bcryptjs from 'bcryptjs';

export const generateHash = async (password: string) => {
  return bcryptjs.hash(password, 10);
};

export const compareHash = async (password: string, hash: string) => {
  return bcryptjs.compare(password, hash);
};

export const generateOtp = async (fixedOtp = false) => {
  const otp = fixedOtp
    ? '555555'
    : String(Math.floor(100000 + Math.random() * 900000));
  console.log('🚀 ~ generateOtp ~ otp:', otp);
  return bcryptjs.hash(otp, 10);
};
