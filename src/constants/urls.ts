export const TELEBIRR_URLS = {
  sandbox: {
    apiBase:
      "https://developerportal.ethiotelebirr.et:38443/apiaccess/payment/gateway",
    webBase:
      "https://developerportal.ethiotelebirr.et:38443/payment/web/paygate?",
  },
  production: {
    apiBase:
      "https://telebirrappcube.ethiomobilemoney.et:38443/apiaccess/payment/gateway",
    webBase:
      "https://telebirrappcube.ethiomobilemoney.et:38443/payment/web/paygate?",
  },
  simulate: {
    apiBase: "https://telebirr-node-simulator.onrender.com",
    webBase: "https://telebirr-node-simulator.onrender.com/web/?",
  },
};

export const CHECKOUT_OTHER_PARAMS = "&version=1.0&trade_type=Checkout";
