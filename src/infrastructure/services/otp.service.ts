const otpStore: { [email: string]: { otp: string; expiresAt: number } } = {};

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOtp = (email: string, otp: string): void => {
  otpStore[email] = { otp, expiresAt: Date.now() + 300000 };
};

export const verifyOtp = (email: string, otp: string): boolean => {
  if (!otpStore[email] || otpStore[email].expiresAt < Date.now()) {
    return false;
  }
  return otpStore[email].otp === otp;
};
