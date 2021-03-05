import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Device } from 'src/app/shared/models/device';
import { TransactionHistory } from 'src/app/shared/models/transaction-history';
import { SubSink } from 'subsink';
import { DeviceService } from '../../devices/device.service';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-device-transactions',
  templateUrl: './device-transactions.component.html',
  styleUrls: ['./device-transactions.component.scss'],
})
export class DeviceTransactionsComponent implements OnInit {
  private _subs = new SubSink();
  @ViewChild('device') device: ElementRef;

  filterForm: FormGroup;

  transactions: TransactionHistory[];
  transaction: TransactionHistory;
  devices: Device[];
  hasTransactions = false;
  totalTransactions: number;
  hasDevices = false;
  viewingTransactions = true;
  viewTransaction = false;
  pageNo = 1;

  error = false;
  warning = false;
  success = false;
  processing: boolean;
  aMessage: string;
  aTitle: string;
  fsDialog = false;

  startDate: string;
  endDate: string;
  maxDate: string;

  constructor(
    private _ts: TransactionService,
    private _router: Router,
    private _auth: AuthService,
    private _deviceService: DeviceService,
    datePipe: DatePipe
  ) {
    const dateFormat = 'yyyy-MM-dd';
    this.startDate = datePipe.transform(
      new Date().setDate(new Date().getDate() - 1),
      dateFormat
    );
    this.maxDate = this.endDate = datePipe.transform(new Date(), dateFormat);
  }

  ngOnInit() {
    this.processing = true;
    this._deviceService
      .getDevices()
      .toPromise()
      .then((data) => {
        if (data.empty) {
          this.processing = false;
          return;
        }

        this.hasDevices = !data.empty;
        this.devices = data.devices;
        this._subs.add(
          this._ts
            .getDeviceTransactions(
              this.devices[0].imei,
              0,
              this.startDate,
              this.endDate
            )
            .subscribe(
              (obs) => {
                this.processing = false;
                this.hasTransactions = !obs.empty;
                this.totalTransactions = obs.total;
                this.transactions = obs.transactions.filter(
                  (t) => t.agentId === this._auth.agentId
                );
              },
              (e) => {
                this._onReqError('Something went wrong. Try again.');
              }
            )
        );
      });
    this.filterForm = new FormGroup({
      startDate: new FormControl(this.startDate, Validators.required),
      endDate: new FormControl(this.endDate, Validators.required),
    });
  }

  addDevices() {
    this._router.navigate(['devices']);
  }

  filterTransactions(page: number) {
    this.processing = true;
    this.transactions = [];
    this.startDate = this.filterForm.get('startDate').value;
    this.endDate = this.filterForm.get('endDate').value;

    this._subs.add(
      this._ts
        .getDeviceTransactions(
          this.device.nativeElement.value,
          page,
          this.startDate,
          this.endDate
        )
        .subscribe(
          (obs) => {
            this.processing = false;
            this.hasTransactions = !obs.empty;
            this.totalTransactions = obs.total;
            this.transactions = obs.transactions.filter(
              (t) => t.agentId === this._auth.agentId
            );
          },
          (e) => {
            this._onReqError('Something went wrong. Try again.');
          }
        )
    );
  }

  changePage(event: any) {
    this.pageNo = event;
    this.filterTransactions(event - 1);
  }

  private _onReqSuccess(message: string) {
    this.processing = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this._router.navigate(['reports', 'device-transactions']);
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
