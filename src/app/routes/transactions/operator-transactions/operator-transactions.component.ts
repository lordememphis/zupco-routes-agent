import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { TransactionHistory } from 'src/app/shared/models/transaction-history.model';
import { SubSink } from 'subsink';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-operator-transactions',
  templateUrl: './operator-transactions.component.html',
  styleUrls: ['./operator-transactions.component.scss'],
})
export class OperatorTransactionsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  filterForm: FormGroup;

  transactions: TransactionHistory[];
  transaction: TransactionHistory;
  hasTransactions = false;
  totalTransactions: number;
  viewingTransactions = true;
  viewTransaction = false;
  pageNo = 1;
  pageLimit = 10;

  error = false;
  warning = false;
  success = false;
  processing = true;
  aMessage: string;
  fsDialog = false;

  startDate: string;
  endDate: string;
  maxDate: string;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private auth: AuthService,
    datePipe: DatePipe,
    titleService: Title
  ) {
    const dateFormat = 'yyyy-MM-dd';
    this.startDate = datePipe.transform(
      new Date().setDate(new Date().getDate() - 1),
      dateFormat
    );
    this.maxDate = this.endDate = datePipe.transform(new Date(), dateFormat);
    titleService.setTitle('Reports — Operator Transactions');
  }

  ngOnInit(): void {
    this.subs.add(
      this.transactionService
        .getTransactionHistory(0, this.pageLimit, this.startDate, this.endDate)
        .subscribe(
          (obs) => {
            this.processing = false;
            this.hasTransactions = !obs.empty;
            this.totalTransactions = obs.total;
            this.transactions = obs.transactions.filter(
              (t) => t.agentId === this.auth.agentId
            );
          },
          (e) => {
            if (!e.error) {
              this.onReqError(
                'The server cannot be reached at the moment. Check your internet connection and try again later'
              );
            } else if (e.error.message) {
              this.onReqError(e.error.message);
            } else {
              this.onReqError('Something went wrong. Try again.');
            }
          }
        )
    );
    this.filterForm = new FormGroup({
      startDate: new FormControl(this.startDate, Validators.required),
      endDate: new FormControl(this.endDate, Validators.required),
    });
  }

  filterTransactions(page: number): void {
    this.processing = true;
    this.transactions = [];
    this.startDate = this.filterForm.get('startDate').value;
    this.endDate = this.filterForm.get('endDate').value;

    this.subs.add(
      this.transactionService
        .getTransactionHistory(
          page,
          this.pageLimit,
          this.startDate,
          this.endDate
        )
        .subscribe(
          (obs) => {
            this.processing = false;
            this.hasTransactions = !obs.empty;
            this.totalTransactions = obs.total;
            this.transactions = obs.transactions.filter(
              (t) => t.agentId === this.auth.agentId
            );
          },
          (e) => {
            if (!e.error) {
              this.onReqError(
                'The server cannot be reached at the moment. Check your internet connection and try again later'
              );
            } else if (e.error.message) {
              this.onReqError(e.error.message);
            } else {
              this.onReqError('Something went wrong. Try again.');
            }
          }
        )
    );
  }

  changePage(event: any): void {
    this.pageNo = event;
    this.filterTransactions(event - 1);
  }

  private onReqSuccess(message: string): void {
    this.processing = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this.router.navigate(['reports', 'account-transactions']);
  }

  private onReqError(message: string): void {
    this.processing = false;
    this.error = true;
    this.aMessage = message;

    setTimeout(() => {
      this.error = false;
    }, 5000);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
