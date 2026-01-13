import { TELEBIRR_URLS, CHECKOUT_OTHER_PARAMS } from "../constants/urls";
import { signRequest } from "../utils/signature";
import { createTimestamp } from "../utils/timestamp";
import { createNonceStr } from "../utils/nonce";
import { TelebirrMode } from "../config/telebirrConfig";

interface CreateCheckoutUrlParams {
  mode: TelebirrMode;
  prepayId: string;
  merchantAppId: string;
  merchantCode: string;
  privateKey: string;
}

export function createCheckoutUrl(params: CreateCheckoutUrlParams): string {
  const map = {
    appid: params.merchantAppId,
    merch_code: params.merchantCode,
    nonce_str: createNonceStr(),
    prepay_id: params.prepayId,
    timestamp: createTimestamp(),
  };

  const sign = signRequest(map, params.privateKey);

  const rawRequest = [
    `appid=${map.appid}`,
    `merch_code=${map.merch_code}`,
    `nonce_str=${map.nonce_str}`,
    `prepay_id=${map.prepay_id}`,
    `timestamp=${map.timestamp}`,
    `sign=${sign}`,
    `sign_type=SHA256WithRSA`,
  ].join("&");

  const webBase = TELEBIRR_URLS[params.mode].webBase;

  return webBase + rawRequest + CHECKOUT_OTHER_PARAMS;
}
