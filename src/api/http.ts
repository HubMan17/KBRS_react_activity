import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api/v1",
  headers: { "Content-Type": "application/json" },
  // withCredentials: false  // не нужно, у нас CSRF exempt
});

export function toMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const s = err.response?.status ?? "ERR";
    const d = err.response?.data;
    return `[${s}] ${typeof d === "string" ? d : JSON.stringify(d)}`;
  }
  return String(err);
}
