export namespace TestimonialProps {
  export type FormProps = {
    page?: number | null;
    limit?: number | null;
    sort_of?: string;
    sort_by?: string;
    name?: string;
    role?: string;
    data?: [];
  };

  export const defaultValuesFormProps: FormProps = {
    page: null,
    limit: null,
    sort_of: "",
    sort_by: "",
    name: "",
    role: "",
    data: [],
  };
}
