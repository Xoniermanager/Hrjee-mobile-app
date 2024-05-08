
import axiosPost from './axiosPost';
export const login = (url,data) => {
  let item = axiosPost(url,data);
  return item;
};
export const Punch_In = (url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const Check_PunchIn = (url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
