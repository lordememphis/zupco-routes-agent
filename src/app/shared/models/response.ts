import { Device } from './device';
import { Operator } from './operator';
import { TransactionHistory } from './transaction-history';

export interface GetResponse {
  content: Operator[] | Device[] | TransactionHistory[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
}
