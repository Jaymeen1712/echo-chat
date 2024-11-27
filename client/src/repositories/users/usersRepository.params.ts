export interface createUserParam {
  email: string;
  isActive: boolean;
  name: string;
  password: string;
  image?: string;
}
export interface postLoginParam {
  email: string;
  password: string;
}
export interface searchUserPostParams {
  query: string;
}
