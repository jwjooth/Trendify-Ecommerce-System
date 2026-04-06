import { api, ResponseProps } from "@/app/lib/api";
import { CATEGORIES_URL } from "@/app/lib/service-url";
import { buildQueryString } from "@/app/utils/queryStringBuilder.util";
import { Categories } from "./type";

export const getAllCategories = async (
  request: Categories,
): Promise<ResponseProps<Categories[]>> => {
  const url = `${CATEGORIES_URL}${buildQueryString(request)}`;
  return (await api.get(url)).data;
};

export const getCategoryById = async (id: number): Promise<ResponseProps<Categories[]>> => {
  const url = `${CATEGORIES_URL}/${id}`;
  return (await api.get(url)).data;
};

export const putCategory = async (
  id: number,
  request: Categories,
): Promise<ResponseProps<Categories[]>> => {
  return (await api.put(`${CATEGORIES_URL}/${id}`, request)).data;
};

export const deleteCategory = async (id: number): Promise<ResponseProps<any>> => {
  return (await api.delete(`${CATEGORIES_URL}/${id}`)).data;
};
