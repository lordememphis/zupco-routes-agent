import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionHistory } from 'src/app/shared/models/transaction-history';
import { SubSink } from 'subsink';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-device-transactions',
  templateUrl: './device-transactions.component.html',
  styleUrls: ['./device-transactions.component.scss'],
})
export class DeviceTransactionsComponent implements OnInit {
  private _subs = new SubSink();

  searchDeviceTransForm: FormGroup;

  transactions: TransactionHistory[];
  transaction: TransactionHistory;
  hasTransactions = false;
  viewingTransactions = true;
  viewTransaction = false;

  error = false;
  warning = false;
  success = false;
  processing: boolean;
  aMessage: string;
  aTitle: string;
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
    this.searchDeviceTransForm = new FormGroup({
      imei: new FormControl(null, Validators.required),
    });
  }

  getTransactionHistory() {
    this.processing = true;

    const imei = this.searchDeviceTransForm.get('imei').value;

    this._subs.add(
      this._ts
        .getDeviceTransactions(imei, this.startDate, this.endDate)
        .subscribe(
          (obs) => {
            this.processing = false;

            if (obs.empty) {
              this.warning = true;
              this.aTitle = 'Notification';
              this.aMessage = `Device ${imei} was either not found or it does not have transactions it has executed. Try another device.`;

              setTimeout(() => {
                this.warning = false;
              }, 5000);
              return;
            }

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
