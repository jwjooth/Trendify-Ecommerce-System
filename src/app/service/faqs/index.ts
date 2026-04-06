import { api, ResponseProps } from "@/app/lib/api";
import { FAQS_URL } from "@/app/lib/service-url";
import { buildQueryString } from "@/app/utils/queryStringBuilder.util";
import { createFAQRequest, FAQ } from "./type";

export const getAllFaqs = async (request: FAQ): Promise<ResponseProps<FAQ[]>> => {
  return (await api.get(`${FAQS_URL}${buildQueryString(request)}`)).data;
};

export const getFaqsById = async (id: number): Promise<ResponseProps<FAQ[]>> => {
  return (await api.get(`${FAQS_URL}/${id}`)).data;
};

export const createFaq = async (request: createFAQRequest): Promise<ResponseProps<FAQ[]>> => {
  return (await api.post(`${FAQS_URL}`, request)).data;
};

export const updateFaq = async (
  id: number,
  request: createFAQRequest,
): Promise<ResponseProps<FAQ[]>> => {
  return (await api.put(`${FAQS_URL}/${id}`, request)).data;
};

export const deleteFaq = async (id: number): Promise<ResponseProps<any>> => {
  return (await api.delete(`${FAQS_URL}/${id}`)).data;
};
