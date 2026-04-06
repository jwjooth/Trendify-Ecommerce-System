import { ResponseProps, api } from "@/app/lib/api";
import { PRODUCTS_URL } from "@/app/lib/service-url";
import { buildQueryString } from "@/app/utils/queryStringBuilder.util";
import { Product, createProductRequest } from "./type";

export const getAllProducts = async (request: Product): Promise<ResponseProps<Product[]>> => {
  const url = `${PRODUCTS_URL}${buildQueryString(request)}`;
  return (await api.get(url)).data;
};

export const getProductById = async (id: number): Promise<ResponseProps<Product[]>> => {
  const url = `${PRODUCTS_URL}/${id}`;
  return (await api.get(url)).data;
};

export const createProduct = async (
  request: createProductRequest,
): Promise<ResponseProps<Product[]>> => {
  return (await api.post(`${PRODUCTS_URL}`, request)).data;
};

export const updateProduct = async (
  id: number,
  request: createProductRequest,
): Promise<ResponseProps<Product[]>> => {
  return (await api.put(`${PRODUCTS_URL}/${id}`, request)).data;
};

export const deleteProduct = async (id: number): Promise<ResponseProps<any>> => {
  return (await api.delete(`${PRODUCTS_URL}/${id}`)).data;
};
