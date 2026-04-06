export interface FAQ {
  page: number;
  limit: number;
  sort_of: string;
  sort_by: string;
  question: string;
}

export interface createFAQRequest {
  answer: string;
  question: string;
}
