export interface CashInOutTransaction {
  originalRef: string;
  agentId: number;
  subscriberMobile: string;
  pin?: string;
  amount: number;
  operatorId: number;
  imei: string;
  operatorCode: string;
  channel: string;
  transactionTypes: string;
}

export interface A2ATransaction {
  originalRef: string;
  senderAgentId: number;
  receiverAgentMobile: string;
  amount: number;
  operatorId: number;
  operatorCode: string;
  channel: string;
  transactionTypes: string;
}

export interface WTBTransaction {
  originalRef: string;
  agentId: number;
  bankId: number;
  bankAccount: string;
  amount: number;
  operatorId: number;
  operatorCode: string;
  channel: string;
  transactionTypes: string;
}
