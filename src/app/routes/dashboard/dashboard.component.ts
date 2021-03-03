import { Component, OnDestroy, OnInit } from '@angular/core';
import { Operator } from 'src/app/shared/models/operator';
import { Device } from 'src/app/shared/models/device';
import { DeviceService } from '../devices/device.service';
import { OperatorService } from '../operators/operator.service';
import { SubSink } from 'subsink';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionService } from '../transactions/transaction.service';
import { DatePipe } from '@angular/common';
import { TransactionHistory } from 'src/app/shared/models/transaction-history';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  devices: Device[] = [];
  operators: Operator[] = [];
  accountTranscations: TransactionHistory[] = [];
  accountBalance: number = 0;
  accountCommission: number = 0;

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
    private _deviceService: DeviceService,
    private _operatorService: OperatorService,
    private _transactionService: TransactionService,
    datePipe: DatePipe
  ) {
    this.startDate = this.endDate = datePipe.transform(
      new Date(),
      'yyyy-MM-dd'
    );
  }

  ngOnInit(): void {
    this._subs.add(
      forkJoin([
        this._deviceService.getDevices(),
        this._operatorService.getOperators(),
        this._transactionService.getTransactionHistory(
          this.startDate,
          this.endDate
        ),
        this._transactionService.getBalances(),
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
            e.error.message
              ? this._onReqError(e.error.message)
              : this._onReqError(
                  'Something went wrong and we could not get your data. Try to refresh page.'
                );
          }
        )
    );
  }

  onFilterDevices(e: any) {
    this.activeDevices = !this.activeDevices;
    this.domDevices = this.devices.filter(
      (device) => device.status === e.target.value
    ).length;
  }

  onFilterOperators(e: any) {
    this.activeOperators = !this.activeOperators;
    this.domOperators = this.operators.filter(
      (operator) => operator.status === e.target.value
    ).length;
  }

  onFilterAccountTransactions(e: any) {
    this.cashInTransactions = !this.cashInTransactions;
    this.domAccountTransactions = this.accountTranscations.filter(
      (transaction) => transaction.transactionType === e.target.value
    ).length;
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
