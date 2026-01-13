export type TelebirrMode = "simulate" | "sandbox" | "production";
export type IntegrationOption = "C2B" | "B2B";
export interface TelebirrConfig {
  appId: string;
  appSecret: string;
  merchantAppId: string;
  merchantCode: string;
  privateKey: string;
  notifyUrl: string;
  redirectUrl: string;
  mode: TelebirrMode;
  http: boolean;
  integrationOption: IntegrationOption;
}
