import { http } from "./http";
import type { DiscordTokenResponse } from "../types/discord";

export async function exchangeToken(code: string) {
  const { data } = await http.post<DiscordTokenResponse>("/discord/token", {
    code,
  });
  return data;
}

export async function notifyAuthorized(payload: {
  channel_id: string;
  username: string;
  user_id: string;
}) {
  const { data } = await http.post("/discord/notify", payload);
  return data;
}
