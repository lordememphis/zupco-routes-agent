import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Device } from 'src/app/shared/models/device.model';
import { TransactionHistory } from 'src/app/shared/models/transaction-history.model';
import { SubSink } from 'subsink';
import { DeviceService } from '../../dashboard/reps/devices/device.service';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-device-transactions',
  templateUrl: './device-transactions.component.html',
  styleUrls: ['./device-transactions.component.scss'],
})
export class DeviceTransactionsComponent implements OnInit, OnDestroy {
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
  private subs = new SubSink();

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private auth: AuthService,
    private deviceService: DeviceService,
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
    this.processing = true;
    this.deviceService
      .getDevices()
      .toPromise()
      .then((data) => {
        if (data.empty) {
          this.processing = false;
          return;
        }

        this.hasDevices = !data.empty;
        this.devices = data.devices;
        this.subs.add(
          this.transactionService
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
      });
    this.filterForm = new FormGroup({
      startDate: new FormControl(this.startDate, Validators.required),
      endDate: new FormControl(this.endDate, Validators.required),
    });
  }

  addDevices(): void {
    this.router.navigate(['devices']);
  }

  filterTransactions(page: number): void {
    this.processing = true;
    this.transactions = [];
    this.startDate = this.filterForm.get('startDate').value;
    this.endDate = this.filterForm.get('endDate').value;

    this.subs.add(
      this.transactionService
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private onReqSuccess(message: string): void {
    this.processing = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this.router.navigate(['reports', 'device-transactions']);
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
