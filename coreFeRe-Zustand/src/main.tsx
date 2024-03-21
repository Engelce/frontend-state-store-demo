import { bootstrap } from "./utils";
import Main from "./module/main";

bootstrap({
  componentType: Main,
  errorListener: {
    onError: () => {},
  },
  loggerConfig: {
    serverURL: "https://localhost/",
    maskedKeywords: [
      /^cvc$/,
      /^cardNumber$/,
      /^expiration_year$/,
      /^expiration_month$/,
      /^expirationDate$/,
      /[Pp]assword/,
    ],
  },
});
