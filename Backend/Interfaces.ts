export interface Client {
  name: string;
  country: "France" | "Germany" | undefined;
}

export interface OnlineClient extends Client {
  connectedSince: number;
  currentPicture?: string;
}

export interface OfflineClient extends Client {
  lastConnected: number;
}

export type WSRes = "onlineClients" | "offlineClients" | "other";
