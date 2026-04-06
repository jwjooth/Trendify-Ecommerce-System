export interface Testimonial {
  page?: number;
  limit?: number;
  sort_of?: string;
  sort_by?: string;
  name?: string;
  role?: string;
  data?: [];
}

export interface createTestimonialRequest {
  avatar: string;
  content: string;
  name: string;
  rating: number;
  role: string;
}
