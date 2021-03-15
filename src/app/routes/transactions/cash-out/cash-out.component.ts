import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CashInOutTransaction } from 'src/app/shared/models/transaction';
import { SubSink } from 'subsink';
import { TransactionService } from '../transaction.service';
import * as UUID from 'uuid-int';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cash-out',
  templateUrl: './cash-out.component.html',
})
export class CashOutComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  transactionForm: FormGroup;
  oAuthForm: FormGroup;
  sAuthForm: FormGroup;
  transactionCode: string;

  error = false;
  success = false;
  aMessage: string;
  processing = false;
  fsDialog = false;
  oAuth = false;
  sAuth = false;

  constructor(
    private _transactionService: TransactionService,
    private _router: Router,
    private _auth: AuthService,
    titleService: Title
  ) {
    this._subs.add(
      this._router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) this.ngOnInit();
      })
    );
    titleService.setTitle('Transactions — Cash Out');
  }

  ngOnInit() {
    this.transactionCode = this._transactionService.CASHOUT_CODE;
    this.transactionForm = new FormGroup({
      reference: new FormControl(
        { value: UUID(0).uuid(), disabled: true },
        Validators.required
      ),
      sMobile: new FormControl(null, Validators.required),
      imei: new FormControl(null, Validators.required),
      type: new FormControl('CASHOUT', Validators.required),
      amount: new FormControl(null, Validators.required),
    });

    this.oAuthForm = new FormGroup({
      code: new FormControl(null, Validators.required),
    });

    this.sAuthForm = new FormGroup({
      pin: new FormControl(null, Validators.required),
    });
  }

  cashOut() {
    const transaction: CashInOutTransaction = {
      originalRef: this.transactionForm.get('reference').value,
      agentId: this._auth.agentId,
      subscriberMobile: this.transactionForm.get('sMobile').value,
      pin: this.sAuthForm.get('pin').value,
      amount: this.transactionForm.get('amount').value,
      operatorId: this._auth.operatorId,
      imei: this.transactionForm.get('imei').value,
      operatorCode: this.oAuthForm.get('code').value,
      channel: 'WEB',
      transactionTypes: this.transactionForm.get('type').value,
    };

    this.processing = true;

    this._subs.add(
      this._transactionService.cashOut(transaction).subscribe(
        () => {
          this._onReqSuccess('Your cash out transaction was successful.');
        },
        (e) => {
          this.oAuthForm.reset();
          this.sAuthForm.reset();
          this.sAuth = false;
          if (!e.response) {
            this._onReqError(
              'The server cannot be reached at the moment. Check your internet connection and try again later'
            );
            return;
          }
          e.error.message
            ? this._onReqError(e.error.message)
            : this._onReqError('Something went wrong. Try again.');
        }
      )
    );
  }

  private _onReqSuccess(message: string) {
    this.processing = false;
    this.fsDialog = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this._router.navigate(['transactions', 'cash-out']);
  }

  private _onReqError(message: string) {
    this.processing = false;
    this.fsDialog = false;
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
