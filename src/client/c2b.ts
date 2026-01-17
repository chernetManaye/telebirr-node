import { TelebirrConfig } from "../types/telebirrConfig";
import { FabricTokenResponse } from "../types/fabricToken";
import { GenerateCheckoutUrlInput } from "../types/createOrder";
import { generateCredentials } from "../utils/credentials";
import { QueryOrderResponse } from "../types/queryOrder";
import { RefundInput, RefundResponse } from "../types/refund";
import { requestToken } from "../services/requestToken";
import { requestCreateOrder } from "../services/requestCreateOrder";
import { requestRefund } from "../services/requestRefundOrder";
import { requestQueryOrder } from "../services/requestQueryOrder";
import { TELEBIRR_URLS, CHECKOUT_OTHER_PARAMS } from "../constants/urls";
import { signRequest } from "../utils/signature";
import { createTimestamp } from "../utils/timestamp";
import { createNonceStr } from "../utils/nonce";
import { GeneratedCredentials } from "../types/credentials";

export class C2B {
  private token?: typeof FabricTokenResponse;
  private config: TelebirrConfig;

  constructor(config: TelebirrConfig) {
    if (config.mode === "simulate") {
      const credentials: GeneratedCredentials = generateCredentials();

      this.config = {
        ...config,
        appId: credentials.FABRIC_APP_ID,
        appSecret: credentials.FABRIC_APP_SECRET,
        merchantAppId: credentials.MERCHANT_APP_ID,
        merchantCode: credentials.MERCHANT_CODE,
        privateKey: credentials.PRIVATE_KEY,
      };
    } else {
      this.config = config;
    }
  }

  async getFabricToken(): Promise<any> {
    if (this.token && !this.isTokenExpired(this.token)) {
      return this.token;
    }

    let token: any = await requestToken(this.config);
    token = JSON.parse(token);
    if (!token) return;
    this.token = token;
    return token;
  }

  private createCheckoutUrl(prepayId: string): string {
    const map = {
      appid: this.config.merchantAppId,
      merch_code: this.config.merchantCode,
      nonce_str: createNonceStr(),
      prepay_id: prepayId,
      timestamp: createTimestamp(),
    };

    const sign = signRequest(map, this.config.privateKey);

    const rawRequest = [
      `appid=${map.appid}`,
      `merch_code=${map.merch_code}`,
      `nonce_str=${map.nonce_str}`,
      `prepay_id=${map.prepay_id}`,
      `timestamp=${map.timestamp}`,
      `sign=${sign}`,
      `sign_type=SHA256WithRSA`,
    ].join("&");

    const webBase = TELEBIRR_URLS[this.config.mode].webBase;

    return webBase + rawRequest + CHECKOUT_OTHER_PARAMS;
  }
  async checkout(input: GenerateCheckoutUrlInput): Promise<string | void> {
    const token = await this.getFabricToken();

    if (!token) return;

    let response: any = await requestCreateOrder(
      token.token,
      input,
      this.config
    );
    if (!response) return;

    return this.createCheckoutUrl(response.data.biz_content.prepay_id);
  }

  async queryOrder(input: string): Promise<QueryOrderResponse | void> {
    let token = await this.getFabricToken();

    if (!token) return;

    const response: any = await requestQueryOrder(
      token.token,
      input,
      this.config
    );

    return response.data;
  }
  async refundOrder(input: RefundInput): Promise<RefundResponse | void> {
    const token = await this.getFabricToken();
    if (!token) return;
    const response: any = await requestRefund(token.token, input, this.config);

    return response.data;
  }

  private static readonly TOKEN_EXPIRY_SAFETY_WINDOW_MS = 5 * 60 * 1000;

  private isTokenExpired(token?: typeof FabricTokenResponse): boolean {
    if (!token) {
      return true;
    }

    const now = Date.now();
    const expiry = this.parseTelebirrDate(token.expirationDate).getTime();

    return now >= expiry - C2B.TOKEN_EXPIRY_SAFETY_WINDOW_MS;
  }

  private parseTelebirrDate(value: string): Date {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6)) - 1;
    const day = Number(value.slice(6, 8));
    const hour = Number(value.slice(8, 10));
    const minute = Number(value.slice(10, 12));
    const second = Number(value.slice(12, 14));

    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }
}
