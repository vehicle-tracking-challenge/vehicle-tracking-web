import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error?.response?.data?.detail;
    const friendlyMessage =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d: { msg: string }) => d.msg).join(", ")
          : "Ocorreu um erro inesperado.";

    error.friendlyMessage = friendlyMessage;
    return Promise.reject(error);
  },
);

export const fetcher = (url: string) =>
  apiClient.get(url).then((res) => res.data);
