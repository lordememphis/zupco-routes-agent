import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from 'src/app/shared/transaction';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private _http: HttpClient) {}

  cashIn(transaction: Transaction): Observable<Object> {
    return this._http.post(
      `${environment.TRANSACTION_SERVICE()}transactions/cash-in`,
      transaction
    );
  }
}
