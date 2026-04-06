export function buildQueryString(params: Record<string, any>) {
  params = params ?? {};
  const query = Object.entries(params)
    .filter(
      ([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(typeof value === "number" && isNaN(value)),
    ) // skip empty or undefined
    .map(([key, value]) => {
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return `${encodeURIComponent(key)}=${value}`;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");
  return query ? `?${query}` : "";
}
