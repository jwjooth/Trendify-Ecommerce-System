import { api, ResponseProps } from "@/app/lib/api";
import { TESTIMONIAL_URL } from "@/app/lib/service-url";
import { buildQueryString } from "@/app/utils/queryStringBuilder.util";
import { createTestimonialRequest, Testimonial } from "./type";

export const getAllTestimonials = async (
  request: Testimonial,
): Promise<ResponseProps<Testimonial[]>> => {
  return (await api.get(`${TESTIMONIAL_URL}${buildQueryString(request)}`)).data;
};

export const getTestimonialById = async (id: number): Promise<ResponseProps<Testimonial[]>> => {
  return (await api.get(`${TESTIMONIAL_URL}/${id}`)).data;
};

export const createTestimonial = async (
  request: createTestimonialRequest,
): Promise<ResponseProps<Testimonial[]>> => {
  return (await api.post(`${TESTIMONIAL_URL}`, request)).data;
};

export const putTestimonial = async (
  id: number,
  request: createTestimonialRequest,
): Promise<ResponseProps<Testimonial[]>> => {
  return (await api.put(`${TESTIMONIAL_URL}/${id}`, request)).data;
};

export const deleteTestimonial = async (id: number): Promise<ResponseProps<any>> => {
  return (await api.delete(`${TESTIMONIAL_URL}/${id}`)).data;
};
