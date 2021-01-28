export interface TransactionHistory {
  version: number;
  id: number;
  transactionDate: string;
  originalReference: string;
  agentId: number;
  agentName: string;
  operatorId: number;
  operatorName: string;
  subscriberId: number;
  mobile: string;
  bankId: number;
  bankName: string;
  bankAccount: string;
  platformAccountId: number;
  source: string;
  destination: string;
  transactionType: string;
  description: string;
  transactionAmount: number;
  fee: number;
  commission: number;
  channel: string;
  typeOfEntry: string;
  status: string;
  imei: string;
}
