import { api, ResponseProps } from "@/app/lib/api";
import { USERS_URL } from "@/app/lib/service-url";
import { buildQueryString } from "@/app/utils/queryStringBuilder.util";
import { putUserRequest, User } from "./type";

export const getAllUsers = async (request: User): Promise<ResponseProps<User[]>> => {
  return (await api.get(`${USERS_URL}${buildQueryString(request)}`)).data;
};

export const putUser = async (
  id: number,
  request: putUserRequest,
): Promise<ResponseProps<User[]>> => {
  return (await api.put(`${USERS_URL}/${id}`, request)).data;
};

export const deleteUser = async (id: number): Promise<ResponseProps<any>> => {
  return (await api.delete(`${USERS_URL}/${id}`)).data;
};
