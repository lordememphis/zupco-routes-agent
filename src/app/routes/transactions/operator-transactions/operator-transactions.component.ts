import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionHistory } from 'src/app/shared/models/transaction-history';
import { SubSink } from 'subsink';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-operator-transactions',
  templateUrl: './operator-transactions.component.html',
  styleUrls: ['./operator-transactions.component.scss'],
})
export class OperatorTransactionsComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  transactions: TransactionHistory[];
  transaction: TransactionHistory;
  hasTransactions = false;
  viewingTransactions = true;
  viewTransaction = false;

  error = false;
  warning = false;
  success = false;
  processing = true;
  aMessage: string;
  fsDialog = false;

  startDate: string;
  endDate: string;

  constructor(
    private _ts: TransactionService,
    private _router: Router,
    datePipe: DatePipe
  ) {
    this.startDate = this.endDate = datePipe.transform(
      new Date(),
      'yyyy-MM-dd'
    );
  }

  ngOnInit() {
    this._subs.add(
      this._ts.getOperatorTransactions(this.startDate, this.endDate).subscribe(
        (obs) => {
          this.processing = false;
          this.transactions = obs.transactions;
          this.hasTransactions = !obs.empty;
        },
        (e) => {
          this._onReqError('Something went wrong. Try again.');
        }
      )
    );
  }

  private _onReqSuccess(message: string) {
    this.processing = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this._router.navigate(['devices']);
  }

  private _onReqError(message: string) {
    this.processing = false;
    this.error = true;
    this.aMessage = message;

    setTimeout(() => {
      this.error = false;
    }, 5000);
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
