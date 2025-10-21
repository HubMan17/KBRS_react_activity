export type DiscordTokenResponse = {
  access_token: string;
  token_type: string; // "Bearer"
  expires_in: number;
  refresh_token?: string;
  scope: string;
  _me?: {
    id: string;
    username: string;
    avatar?: string | null;
    // можно расширить по необходимости
  };
};

export type NotifyRequest = {
  channel_id: string;
  username: string;
  user_id: string;
};
