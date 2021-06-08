import { Component, OnDestroy, OnInit } from '@angular/core';
import { Operator } from 'src/app/shared/models/operator.model';
import { OperatorService } from '../reps/operators/operator.service';
import { SubSink } from 'subsink';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionService } from '../../transactions/transaction.service';
import { DatePipe } from '@angular/common';
import { TransactionHistory } from 'src/app/shared/models/transaction-history.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit, OnDestroy {
  operators: Operator[] = [];
  accountTransactions: TransactionHistory[] = [];
  accountBalance = 0;
  accountCommission = 0;
  domOperators: number;
  domAccountTransactions: number;
  activeDevices = true;
  activeOperators = true;
  cashInTransactions = true;
  processing = true;
  error = false;
  aMessage: string;
  startDate: string;
  endDate: string;
  private subs = new SubSink();

  constructor(
    private operatorService: OperatorService,
    private transactionService: TransactionService,
    datePipe: DatePipe,
    titleService: Title
  ) {
    this.startDate = '2021-01-01';
    this.endDate = datePipe.transform(new Date(), 'yyyy-MM-dd');
    titleService.setTitle('Dashboard Overview');
  }

  ngOnInit(): void {
    this.subs.add(
      forkJoin([
        this.operatorService.getOperators(),
        this.transactionService.getTransactionHistory(
          0,
          9999,
          this.startDate,
          this.endDate
        ),
        this.transactionService.getBalances(),
      ])
        .pipe(
          map(([operators, operatorTransactions, balances]) => {
            return { operators, operatorTransactions, balances };
          })
        )
        .subscribe(
          (data) => {
            this.operators = data.operators.operators;
            this.accountTransactions = data.operatorTransactions.transactions;

            this.domOperators = this.operators.filter(
              (operator) => operator.status === 'ACTIVE'
            ).length;

            this.domAccountTransactions = this.accountTransactions.filter(
              (transaction) => transaction.transactionType === 'AGENT_TRANSFER'
            ).length;

            this.accountBalance = data.balances.balance;
            this.accountCommission = data.balances.commission;

            this.processing = false;
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

  onFilterOperators(e: any): void {
    this.activeOperators = !this.activeOperators;
    this.domOperators = this.operators.filter(
      (operator) => operator.status === e.target.value
    ).length;
  }

  onFilterAccountTransactions(e: any): void {
    this.cashInTransactions = !this.cashInTransactions;
    this.domAccountTransactions = this.accountTransactions.filter(
      (transaction) => transaction.transactionType === e.target.value
    ).length;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private onReqError(message: string): void {
    this.processing = false;
    this.error = true;
    this.aMessage = message;

    setTimeout(() => {
      this.error = false;
    }, 5000);
  }
}
