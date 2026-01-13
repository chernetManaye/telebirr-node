import axios from "axios";
import { TelebirrConfig } from "../config/telebirrConfig";
import { TELEBIRR_URLS } from "../constants/urls";

import { Agent } from "node:https";

export function createTelebirrHttpClient(config: TelebirrConfig) {
  return axios.create({
    baseURL: TELEBIRR_URLS[config.mode].apiBase,
    headers: {
      "Content-Type": "application/json",
      "X-APP-Key": config.appId,
    },
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  });
}
