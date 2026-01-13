import { TelebirrMode } from "../config/telebirrConfig";
export interface ApplyFabricTokenRequest {
  appSecret: string;
  mode: TelebirrMode;
}

export interface FabricTokenResponse {
  token: string; // "Bearer xxxxx"
  effectiveDate: string; // yyyyMMddHHmmss
  expirationDate: string; // yyyyMMddHHmmss
}
