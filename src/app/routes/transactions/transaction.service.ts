import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { GetResponse } from 'src/app/shared/models/response';
import {
  A2ATransaction,
  CashInOutTransaction,
  WTBTransaction,
} from 'src/app/shared/models/transaction';
import { TransactionHistory } from 'src/app/shared/models/transaction-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private _http: HttpClient, private _auth: AuthService) {}

  cashIn(transaction: CashInOutTransaction): Observable<boolean> {
    return this._http
      .post(
        `${environment.TRANSACTION_SERVICE()}transactions/cash-in`,
        transaction
      )
      .pipe(map(() => true));
  }

  cashOut(transaction: CashInOutTransaction): Observable<boolean> {
    return this._http
      .post(
        `${environment.TRANSACTION_SERVICE()}transactions/cash-out`,
        transaction
      )
      .pipe(map(() => true));
  }

  agentToAgent(transaction: A2ATransaction): Observable<boolean> {
    return this._http
      .post(
        `${environment.TRANSACTION_SERVICE()}transactions/agent-transfer`,
        transaction
      )
      .pipe(map(() => true));
  }

  walletToBank(transaction: WTBTransaction): Observable<boolean> {
    return this._http
      .post(
        `${environment.TRANSACTION_SERVICE()}transactions/agent-wallet-to-bank`,
        transaction
      )
      .pipe(map(() => true));
  }

  getOperatorTransactions(
    startDate: string,
    endDate: string
  ): Observable<{
    transactions: TransactionHistory[] | any[];
    empty: boolean;
    total: number;
  }> {
    return this._http
      .get<GetResponse>(
        `${environment.TRANSACTION_SERVICE()}transactions/operator/0/10?tellerId=${
          this._auth.userId
        }&startDate=${startDate}&endDate=${endDate}`
      )
      .pipe(
        map((data) => {
          return {
            transactions: data.content,
            empty: data.empty,
            total: data.totalElements,
          };
        })
      );
  }

  getDeviceTransactions(
    imei: string,
    startDate: string,
    endDate: string
  ): Observable<{
    transactions: TransactionHistory[] | any[];
    empty: boolean;
    total: number;
  }> {
    return this._http
      .get<GetResponse>(
        `${environment.TRANSACTION_SERVICE()}transactions/device/0/10?imei=${imei}&startDate=${startDate}&endDate=${endDate}`
      )
      .pipe(
        map((data) => {
          return {
            transactions: data.content,
            empty: data.empty,
            total: data.totalElements,
          };
        })
      );
  }
}
