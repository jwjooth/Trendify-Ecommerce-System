import { api, ResponseProps } from "@/app/lib/api";
import { LOGIN_URL, REGISTER_URL } from "@/app/lib/service-url";
import { Auth } from "./type";

export const login = async (request: Auth): Promise<ResponseProps<any>> => {
  return (await api.post(`${LOGIN_URL}`, request)).data;
};

export const register = async (request: Auth): Promise<ResponseProps<any>> => {
  return (await api.post(`${REGISTER_URL}`, request)).data;
};
