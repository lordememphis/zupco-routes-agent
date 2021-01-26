export interface Transaction {
  originalRef: string;
  agentId: number;
  subscriberMobile: string;
  amount: number;
  operatorId: number;
  imei: string;
  operatorCode: string;
  channel: string;
  transactionTypes: string;
}
