export interface Client {
    name: string;
    clientId: string;
    country: "France" | "Germany" | undefined;
}

export interface OnlineClient extends Client {
    connectedSince: number;
    currentPicture?: string;
}

export interface OfflineClient extends Client {
    connectedLast: number;
    duration: number;
}
