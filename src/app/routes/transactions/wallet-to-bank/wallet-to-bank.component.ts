import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { WTBTransaction } from 'src/app/shared/models/transaction';
import { SubSink } from 'subsink';
import * as UUID from 'uuid-int';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-wallet-to-bank',
  templateUrl: './wallet-to-bank.component.html',
  styleUrls: ['./wallet-to-bank.component.scss'],
})
export class WalletToBankComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  transactionForm: FormGroup;
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
    this.transactionForm = new FormGroup({
      reference: new FormControl(
        { value: UUID(0).uuid(), disabled: true },
        Validators.required
      ),
      bankId: new FormControl(null, Validators.required),
      type: new FormControl('CASHIN', Validators.required),
      amount: new FormControl(null, Validators.required),
    });

    this.authForm = new FormGroup({
      code: new FormControl(null, Validators.required),
    });
  }

  walletTransfer() {
    const transaction: WTBTransaction = {
      originalRef: this.transactionForm.get('reference').value,
      agentId: this._auth.agentId,
      bankId: this.transactionForm.get('bankId').value,
      amount: this.transactionForm.get('amount').value,
      operatorId: this._auth.userId,
      operatorCode: this.authForm.get('code').value,
      channel: 'WEB',
      transactionTypes: this.transactionForm.get('type').value,
    };

    this.processing = true;

    this._subs.add(
      this._ts.walletToBank(transaction).subscribe(
        () => {
          this.processing = false;
          this._onReqSuccess('Your wallet to bank transfer was successful.');
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
    this.fsDialog = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this._router.navigate(['devices']);
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
