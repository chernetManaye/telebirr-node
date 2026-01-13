import { AxiosInstance } from "axios";
import {
  ApplyFabricTokenRequest,
  FabricTokenResponse,
} from "../types/fabricToken";
import { TELEBIRR_URLS } from "../constants/urls";

export async function applyFabricToken(
  client: AxiosInstance,
  payload: ApplyFabricTokenRequest
): Promise<FabricTokenResponse> {
  const appSecret = payload.appSecret;
  const response = await client.post<FabricTokenResponse>(
    `${TELEBIRR_URLS[payload.mode].apiBase}/payment/v1/token`,
    { appSecret }
  );

  return response.data;
}
