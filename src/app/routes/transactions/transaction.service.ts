import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Bank } from 'src/app/shared/models/bank';
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
  private _CASH_IN_TRANSACTION_CODE = 'CASHIN';
  private _CASH_OUT_TRANSACTION_CODE = 'CASHOUT';
  private _AGENT_TO_AGENT_TRANSACTION_CODE = 'AGENT_TRANSFER';
  private _WALLET_TO_BANK_TRANSACTION_CODE = 'AGENT_WALLET_TO_BANK';

  constructor(private _http: HttpClient, private _auth: AuthService) {}

  get CASHIN_CODE(): string {
    return this._CASH_IN_TRANSACTION_CODE;
  }

  get CASHOUT_CODE(): string {
    return this._CASH_OUT_TRANSACTION_CODE;
  }

  get A2A_CODE(): string {
    return this._AGENT_TO_AGENT_TRANSACTION_CODE;
  }

  get WTB_CODE(): string {
    return this._WALLET_TO_BANK_TRANSACTION_CODE;
  }

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

  getTransactionHistory(
    page: number,
    limit: number,
    startDate: string,
    endDate: string
  ): Observable<{
    transactions: TransactionHistory[] | any[];
    empty: boolean;
    total: number;
  }> {
    if (this._auth.rauthenticated)
      return this._http
        .get<GetResponse>(
          `${environment.TRANSACTION_SERVICE()}transactions/agent/${page}/${limit}?agentId=${
            this._auth.agentId
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
    return this._http
      .get<GetResponse>(
        `${environment.TRANSACTION_SERVICE()}transactions/operator/${page}/10?tellerId=${
          this._auth.operatorId
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
    page: number,
    startDate: string,
    endDate: string
  ): Observable<{
    transactions: TransactionHistory[] | any[];
    empty: boolean;
    total: number;
  }> {
    return this._http
      .get<GetResponse>(
        `${environment.TRANSACTION_SERVICE()}transactions/device/${page}/10?imei=${imei}&startDate=${startDate}&endDate=${endDate}`
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

  getBalances(): Observable<{ balance: number; commission: number }> {
    return this._http
      .get<{
        accountBalance: number;
        commissionBalance: number;
        totalAmount: number;
      }>(
        `${environment.TRANSACTION_SERVICE()}transactions/agent-balance/${
          this._auth.agentMobile
        }`
      )
      .pipe(
        map((data) => {
          return {
            balance: data.accountBalance,
            commission: data.commissionBalance,
          };
        })
      );
  }

  getBanks(): Observable<Bank[]> {
    return this._http
      .get<{ content: Bank[] }>(`${environment.AGENT_SERVICE()}bank/0/1000`)
      .pipe(map((data) => data.content));
  }

  generateMerchantTransactionsReport(
    format: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this._http.get<GetResponse>(
      `${environment.AUDIT_TRAIL_SERVICE()}audits/generate-merchant-transactions-report?reportFormat=${format}&merchantId=${
        this._auth.agentId
      }&startDate=${startDate}&endDate=${endDate}`
    );
  }
}
