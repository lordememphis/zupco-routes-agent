import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { GetResponse } from 'src/app/shared/models/response';
import { Transaction } from 'src/app/shared/models/transaction';
import { TransactionHistory } from 'src/app/shared/models/transaction-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private _http: HttpClient, private _auth: AuthService) {}

  cashIn(transaction: Transaction): Observable<Object> {
    return this._http.post(
      `${environment.TRANSACTION_SERVICE()}transactions/cash-in`,
      transaction
    );
  }

  cashOut(transaction: Transaction): Observable<Object> {
    return this._http.post(
      `${environment.TRANSACTION_SERVICE()}transactions/cash-out`,
      transaction
    );
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
}
