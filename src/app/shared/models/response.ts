import { Device } from './device';
import { Operator } from './operator';

export interface GetResponse {
  content: Operator[] | Device[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
}
