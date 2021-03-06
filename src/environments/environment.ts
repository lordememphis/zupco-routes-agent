// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_URL: 'https://api-akupay.jugaad.co.zw/',
  OAUTH_SERVICE(): string {
    return `${this.BASE_URL}akupay-oauth-service/api/v1/`;
  },
  AGENT_SERVICE(): string {
    return `${this.BASE_URL}akupay-agent-service/api/v1/`;
  },
  TRANSACTION_SERVICE(): string {
    return `${this.BASE_URL}akupay-transaction-service/api/v1/`;
  },
  USER_SERVICE(): string {
    return `${this.BASE_URL}akupay-user-manager/api/v1/`;
  },
  SUBSCRIBER_SERVICE(): string {
    return `${this.BASE_URL}akupay-system-service/api/v1/`;
  },
  CASH_IN_TRANSACTION_CODE: 'CASHIN',
  CASH_OUT_TRANSACTION_CODE: 'CASHOUT',
  AGENT_TO_AGENT_TRANSACTION_CODE: 'AGENT_TRANSFER',
  WALLET_TO_BANK_TRANSACTION_CODE: 'AGENT_WALLET_TO_BANK',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
