import { Device } from './device.model';
import { Operator } from './operator.model';
import { TransactionHistory } from './transaction-history.model';

export interface GetResponse {
  content: Array<Operator> | Array<Device> | Array<TransactionHistory>;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
}
