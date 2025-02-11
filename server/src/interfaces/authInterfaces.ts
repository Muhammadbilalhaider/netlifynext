export interface comparePasswordPayload {
  id: string,
  password: string,
  userPassword: string,
  email: string,
  name?: string,
  type?: string,
};

export interface OTPPayload {
  id: string,
  _id?: string,
  email: string,
  token?: string,
  type? :string,
  twoFactorEnabled? :number,
  isActive? :number
};
export interface updateUser {
  id?: string,
  _id?: string,
  email?: string,
  token?: string,
  type? :string,
  twoFactorEnabled? :number,
  isActive? :number,
  ssoEmail?: string,
  googleId?: string
};

export interface userDetailServicePayload {
  userId: string,
  linkHash: string,
  type: string,
  email: string,
};