import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Transaction } from 'src/app/shared/models/transaction';
import { SubSink } from 'subsink';
import { TransactionService } from '../transaction.service';
import * as UUID from 'uuid-int';

@Component({
  selector: 'app-cash-in',
  templateUrl: './cash-in.component.html',
  styleUrls: ['./cash-in.component.scss'],
})
export class CashInComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  cashInForm: FormGroup;
  authForm: FormGroup;

  error = false;
  success = false;
  aMessage: string;
  processing = false;
  fsDialog = false;

  constructor(
    private _ts: TransactionService,
    private _router: Router,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    this.cashInForm = new FormGroup({
      reference: new FormControl(
        { value: UUID(0).uuid(), disabled: true },
        Validators.required
      ),
      sMobile: new FormControl(null, Validators.required),
      imei: new FormControl(null, Validators.required),
      type: new FormControl('CASHIN', Validators.required),
      amount: new FormControl(null, Validators.required),
    });

    this.authForm = new FormGroup({
      code: new FormControl(null, Validators.required),
    });
  }

  cashIn() {
    const transaction: Transaction = {
      originalRef: this.cashInForm.get('reference').value,
      agentId: this._auth.agentId,
      subscriberMobile: this.cashInForm.get('sMobile').value,
      amount: this.cashInForm.get('amount').value,
      operatorId: this._auth.userId,
      imei: this.cashInForm.get('imei').value,
      operatorCode: this.authForm.get('code').value,
      channel: 'WEB',
      transactionTypes: this.cashInForm.get('type').value,
    };

    this.processing = true;

    this._subs.add(
      this._ts.cashIn(transaction).subscribe(
        (res) => {
          console.log(res);
          this.processing = false;
        },
        (e) => {
          e.error.message
            ? this._onReqError(e.error.message)
            : this._onReqError('Something went wrong. Try again.');
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
