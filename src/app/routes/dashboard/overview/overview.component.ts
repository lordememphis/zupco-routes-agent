import { Component, OnDestroy, OnInit } from '@angular/core';
import { Operator } from 'src/app/shared/models/operator.model';
import { Device } from 'src/app/shared/models/device.model';
import { DeviceService } from '../reps/devices/device.service';
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
  private subs = new SubSink();

  devices: Device[] = [];
  operators: Operator[] = [];
  accountTranscations: TransactionHistory[] = [];
  accountBalance = 0;
  accountCommission = 0;

  domDevices: number;
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

  constructor(
    private deviceService: DeviceService,
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
        this.deviceService.getDevices(),
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
          map(([devices, operators, operatorTransactions, balances]) => {
            return { devices, operators, operatorTransactions, balances };
          })
        )
        .subscribe(
          (data) => {
            this.devices = data.devices.devices;
            this.operators = data.operators.operators;
            this.accountTranscations = data.operatorTransactions.transactions;

            this.domDevices = this.devices.filter(
              (device) => device.status === 'ACTIVE'
            ).length;

            this.domOperators = this.operators.filter(
              (operator) => operator.status === 'ACTIVE'
            ).length;

            this.domAccountTransactions = this.accountTranscations.filter(
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

  onFilterDevices(e: any): void {
    this.activeDevices = !this.activeDevices;
    this.domDevices = this.devices.filter(
      (device) => device.status === e.target.value
    ).length;
  }

  onFilterOperators(e: any): void {
    this.activeOperators = !this.activeOperators;
    this.domOperators = this.operators.filter(
      (operator) => operator.status === e.target.value
    ).length;
  }

  onFilterAccountTransactions(e: any): void {
    this.cashInTransactions = !this.cashInTransactions;
    this.domAccountTransactions = this.accountTranscations.filter(
      (transaction) => transaction.transactionType === e.target.value
    ).length;
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
